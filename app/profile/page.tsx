"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Upload, Loader2, CheckCircle, Settings, Users, ChevronDown, Eye, EyeOff, Trash2, Edit2 } from "lucide-react"

interface Profile {
  id: string
  full_name: string
  avatar_url: string | null
  is_admin: boolean
}

interface User {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  is_admin: boolean
  location: string | null
  last_seen: string
  created_at: string
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [supabase, setSupabase] = useState<any>(null)
  const router = useRouter()

  const [showMenu, setShowMenu] = useState(false)
  const [activeTab, setActiveTab] = useState<"settings" | "admin">("settings")
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingUserData, setEditingUserData] = useState({ full_name: "", location: "" })

  useEffect(() => {
    setSupabase(createClient())
  }, [])

  useEffect(() => {
    if (!supabase) return

    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (data) {
        setProfile(data)
        setFullName(data.full_name || "")
      }
      setLoading(false)
    }

    fetchProfile()
  }, [supabase, router])

  const fetchAllUsers = async () => {
    if (!profile?.is_admin) return

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, is_admin, location, last_seen, created_at")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setAllUsers(data)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", profile.id)

    if (!error) {
      setMessage("Profile updated successfully!")
      setTimeout(() => setMessage(null), 3000)
      setProfile({ ...profile, full_name: fullName })
    } else {
      setMessage("Error updating profile")
    }
    setSaving(false)
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    setSaving(true)

    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const dataUrl = reader.result as string

        const { error } = await supabase.from("profiles").update({ avatar_url: dataUrl }).eq("id", profile.id)

        if (!error) {
          setProfile({ ...profile, avatar_url: dataUrl })
          setMessage("Photo updated successfully!")
          setTimeout(() => setMessage(null), 3000)
        }
        setSaving(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setSaving(false)
      setMessage("Error uploading photo")
    }
  }

  const startEditUser = (user: User) => {
    setEditingUser(user)
    setEditingUserData({ full_name: user.full_name, location: user.location || "" })
  }

  const saveEditUser = async () => {
    if (!editingUser) return

    setSaving(true)
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: editingUserData.full_name, location: editingUserData.location })
      .eq("id", editingUser.id)

    if (!error) {
      setMessage("User updated successfully!")
      setEditingUser(null)
      await fetchAllUsers()
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage("Error updating user")
    }
    setSaving(false)
  }

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    setSaving(true)
    const { error } = await supabase.from("profiles").delete().eq("id", userId)

    if (!error) {
      setMessage("User deleted successfully!")
      await fetchAllUsers()
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage("Error deleting user")
    }
    setSaving(false)
  }

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    setSaving(true)
    const { error } = await supabase.from("profiles").update({ is_admin: !currentStatus }).eq("id", userId)

    if (!error) {
      setMessage("Admin status updated successfully!")
      await fetchAllUsers()
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage("Error updating admin status")
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin-slow" />
            <p className="text-foreground/60">Loading profile...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <p className="text-lg text-foreground/60">Profile not found</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-foreground animate-fade-in">My Profile</h1>

          {profile.is_admin && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 font-semibold"
              >
                <ChevronDown size={20} />
                Menu
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 animate-fade-in">
                  <button
                    onClick={() => {
                      setActiveTab("settings")
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-secondary transition-colors rounded-t-lg"
                  >
                    <Settings size={18} />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("admin")
                      setShowMenu(false)
                      fetchAllUsers()
                    }}
                    className="w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-secondary transition-colors rounded-b-lg border-t border-border"
                  >
                    <Users size={18} />
                    Admin Menu
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div
            className="bg-card border-2 border-border rounded-lg p-8 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            {message && (
              <div className="mb-6 p-4 bg-green-100/50 border border-green-400/50 text-green-700 rounded-lg flex items-center gap-2 animate-fade-in">
                <CheckCircle size={20} />
                {message}
              </div>
            )}

            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-4 overflow-hidden flex items-center justify-center border-4 border-primary/10 hover:scale-105 transition-transform duration-300">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url || "/placeholder.svg"}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl">👤</span>
                )}
              </div>
              <label className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer transition-all duration-300 hover:scale-105 font-semibold">
                <Upload size={20} />
                {saving ? "Uploading..." : "Change Photo"}
                <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={saving} className="hidden" />
              </label>
            </div>

            {/* Edit Name */}
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input text-foreground transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">Email (ID)</label>
                <input
                  type="email"
                  value={profile.id}
                  disabled
                  className="w-full px-4 py-2 border border-border rounded-lg bg-secondary/50 text-foreground/50 cursor-not-allowed"
                />
                <p className="text-sm text-foreground/60 mt-1">Email cannot be changed</p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all duration-300 hover:scale-105 font-semibold flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 size={20} className="animate-spin-slow" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Admin Menu Tab */}
        {activeTab === "admin" && profile.is_admin && (
          <div className="bg-card border-2 border-border rounded-lg p-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-foreground">User Management</h2>

            {message && (
              <div className="mb-6 p-4 bg-green-100/50 border border-green-400/50 text-green-700 rounded-lg flex items-center gap-2 animate-fade-in">
                <CheckCircle size={20} />
                {message}
              </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
              <div className="mb-8 p-6 bg-secondary/50 border border-border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Edit User: {editingUser.full_name}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editingUserData.full_name}
                      onChange={(e) => setEditingUserData({ ...editingUserData, full_name: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Location</label>
                    <input
                      type="text"
                      value={editingUserData.location}
                      onChange={(e) => setEditingUserData({ ...editingUserData, location: e.target.value })}
                      placeholder="e.g., Indonesia"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={saveEditUser}
                      disabled={saving}
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditingUser(null)}
                      className="flex-1 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/90 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Location</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Last Seen</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4">{user.full_name || "N/A"}</td>
                      <td className="py-3 px-4 text-foreground/70">{user.id}</td>
                      <td className="py-3 px-4">{user.location || "Not set"}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {user.last_seen && new Date(user.last_seen).getTime() > Date.now() - 5 * 60000 ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <Eye size={16} />
                              Online
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-foreground/50">
                              <EyeOff size={16} />
                              Offline
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-foreground/70">
                        {user.last_seen ? new Date(user.last_seen).toLocaleDateString() : "Never"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditUser(user)}
                            className="p-2 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                            className={`p-2 rounded transition-colors ${user.is_admin ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            title={user.is_admin ? "Remove admin" : "Make admin"}
                          >
                            {user.is_admin ? "Admin" : "User"}
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {allUsers.length === 0 && (
              <div className="text-center py-8 text-foreground/60">
                <p>No users found</p>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  )
}
