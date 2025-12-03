"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import Navbar from "@/components/navbar"
import { useRouter } from "next/navigation"
import { Send, LogIn, Loader2 } from "lucide-react"

interface ChatMessage {
  id: string
  message: string
  user_id: string
  created_at: string
  profiles?: { full_name: string }
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    setSupabase(createClient())
  }, [])

  useEffect(() => {
    if (!supabase) return

    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          await fetchMessages()
          setLoading(false)

          const channel = supabase
            .channel("chat_messages")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (payload) => {
              setMessages((prev) => [...prev, payload.new])
            })
            .subscribe()

          return () => {
            supabase.removeChannel(channel)
          }
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error("Error checking user:", error)
        setLoading(false)
      }
    }

    checkUser()
  }, [supabase])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchMessages = async () => {
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from("chat_messages")
        .select("id, message, user_id, created_at")
        .order("created_at", { ascending: true })
        .limit(100)

      if (messagesError) {
        console.log("[v0] Chat fetch error:", messagesError)
        return
      }

      // Get all unique user IDs from messages
      const userIds = [...new Set(messagesData.map((msg: ChatMessage) => msg.user_id))]

      // Fetch profiles for those users
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds)

      if (profilesError) {
        console.log("[v0] Profiles fetch error:", profilesError)
        // Still show messages even if profiles fail
        setMessages(messagesData as ChatMessage[])
        return
      }

      // Create a map of user_id to full_name
      const profileMap: Record<string, string> = {}
      profilesData?.forEach((profile) => {
        profileMap[profile.id] = profile.full_name
      })

      // Merge profiles into messages
      const messagesWithProfiles = messagesData.map((msg: ChatMessage) => ({
        ...msg,
        profiles: { full_name: profileMap[msg.user_id] || "Anonymous" },
      }))

      setMessages(messagesWithProfiles as ChatMessage[])
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    setSending(true)
    const { error } = await supabase.from("chat_messages").insert({
      message: newMessage,
      user_id: user.id,
    })

    if (!error) {
      setNewMessage("")
    }
    setSending(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin-slow" />
            <p className="text-foreground/60">Loading chat...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="max-w-2xl mx-auto px-4 py-16 animate-fade-in">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Public Chat</h1>
            <p className="text-lg text-foreground/60 mb-8">Please log in to participate in the chat</p>
            <button
              onClick={() => router.push("/auth/login")}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 mx-auto font-semibold"
            >
              <LogIn size={20} />
              Login to Chat
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-foreground animate-fade-in">Public Chat</h1>

        {/* Messages Container */}
        <div className="flex-1 bg-card border border-border rounded-lg p-6 mb-6 overflow-y-auto max-h-[60vh] space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-foreground/60 py-12">
              <p>No messages yet. Be the first to chat!</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex ${msg.user_id === user.id ? "justify-end" : "justify-start"} animate-slide-in-left`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                    msg.user_id === user.id
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-secondary text-foreground rounded-bl-none"
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">{msg.profiles?.full_name || "Anonymous"}</p>
                  <p className="break-words">{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${msg.user_id === user.id ? "text-primary-foreground/70" : "text-foreground/50"}`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2 animate-fade-in-down">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input text-foreground transition-all duration-300"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all duration-300 hover:scale-105 flex items-center gap-2 font-semibold"
          >
            {sending ? <Loader2 size={20} className="animate-spin-slow" /> : <Send size={20} />}
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      </section>
    </main>
  )
}
