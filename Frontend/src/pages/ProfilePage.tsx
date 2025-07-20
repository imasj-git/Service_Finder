import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Camera, Calendar, CheckCircle, XCircle, Clock, Minus, LogOut } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
});

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      bio: '',
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setLoading(true);
    setError(null);
    fetch(`${import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth/me` : 'http://localhost:5000/api/v1/auth/me'}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.message || 'Failed to fetch profile');
        setUserId(data.data._id);
        form.reset({
          fullName: `${data.data.fname} ${data.data.lname}`,
          email: data.data.email,
          phone: data.data.phone || '',
          address: data.data.address || '',
          bio: data.data.bio || '',
        });
      })
      .catch(err => setError(err.message || 'Error fetching profile'))
      .finally(() => setLoading(false));
  }, [form]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setBookingsLoading(true);
    setBookingsError(null);
    fetch(`${import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/booking/my` : 'http://localhost:5000/api/v1/booking/my'}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.message || 'Failed to fetch bookings');
        setBookings(data.data || []);
      })
      .catch(err => setBookingsError(err.message || 'Error fetching bookings'))
      .finally(() => setBookingsLoading(false));
  }, []);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');
      const [fname, ...lnameArr] = values.fullName.split(' ');
      const lname = lnameArr.join(' ');
      const res = await fetch(`${import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth/me` : 'http://localhost:5000/api/v1/auth/me'}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fname,
          lname,
          email: values.email,
          phone: values.phone,
          address: values.address,
          bio: values.bio,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      toast({
        title: 'Success!',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      setError(error.message || 'Failed to update profile. Please try again.');
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Show success message
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    
    // Redirect to home page
    window.location.href = '/';
  };

  if (loading) return <div className="text-center py-12">Loading profile...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-purple-50">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Header */}
            <Card className="shadow-xl border-brand-200">
              
                
            </Card>

            {/* Profile Form */}
            <Card className="shadow-xl border-brand-200">
              <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">Profile Information</CardTitle>
                <CardDescription>Update your personal information and preferences.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="Enter your full name" 
                                  className="pl-10 border-brand-200 focus:border-brand-500" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="Enter your email" 
                                  className="pl-10 border-brand-200 focus:border-brand-500" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="Enter your phone number" 
                                  className="pl-10 border-brand-200 focus:border-brand-500" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="Enter your address" 
                                  className="pl-10 border-brand-200 focus:border-brand-500" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us a bit about yourself..." 
                              className="border-brand-200 focus:border-brand-500" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-brand-600 hover:bg-brand-700 text-white"
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        className="border-brand-200 text-brand-600 hover:bg-brand-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Logout Section */}
            <Card className="shadow-xl border-red-200">
              <CardHeader>
                <CardTitle className="text-xl text-red-600">Account Actions</CardTitle>
                <CardDescription>Manage your account settings and logout.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-2">Ready to leave?</p>
                    <p className="text-sm text-gray-500">Click the logout button below to securely sign out of your account.</p>
                  </div>
                  <Button 
                    onClick={handleLogout}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bookings Section */}
            <Card className="shadow-xl border-brand-200">
              <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">My Bookings</CardTitle>
                <CardDescription>View your recent and upcoming bookings.</CardDescription>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="text-center py-8">Loading bookings...</div>
                ) : bookingsError ? (
                  <div className="text-center text-red-500 py-8">{bookingsError}</div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No bookings found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Provider</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking: any) => {
                          let status = booking.status;
                          let statusLabel = status;
                          let statusColor = "";
                          let statusIcon = null;
                          if (status === 'completed') { statusLabel = 'Completed'; statusColor = 'text-green-600'; statusIcon = <CheckCircle className="inline h-4 w-4 mr-1 text-green-500" />; }
                          else if (status === 'pending') { statusLabel = 'Pending'; statusColor = 'text-yellow-600'; statusIcon = <Clock className="inline h-4 w-4 mr-1 text-yellow-500" />; }
                          else if (status === 'confirmed') { statusLabel = 'In Progress'; statusColor = 'text-blue-600'; statusIcon = <Calendar className="inline h-4 w-4 mr-1 text-blue-500" />; }
                          else if (status === 'cancelled') { statusLabel = 'Cancelled'; statusColor = 'text-red-600'; statusIcon = <XCircle className="inline h-4 w-4 mr-1 text-red-500" />; }
                          // Payment status
                          let paymentStatus = booking.paymentStatus;
                          let paymentLabel = paymentStatus;
                          let paymentColor = "";
                          let paymentIcon = null;
                          if (paymentStatus === 'paid') { paymentLabel = 'Paid'; paymentColor = 'text-green-600'; paymentIcon = <CheckCircle className="inline h-4 w-4 mr-1 text-green-500" />; }
                          else if (paymentStatus === 'pending') { paymentLabel = 'Pending'; paymentColor = 'text-yellow-600'; paymentIcon = <Clock className="inline h-4 w-4 mr-1 text-yellow-500" />; }
                          else if (paymentStatus === 'failed') { paymentLabel = 'Failed'; paymentColor = 'text-red-600'; paymentIcon = <XCircle className="inline h-4 w-4 mr-1 text-red-500" />; }
                          else if (paymentStatus === 'refunded') { paymentLabel = 'Refunded'; paymentColor = 'text-gray-600'; paymentIcon = <XCircle className="inline h-4 w-4 mr-1 text-gray-500" />; }
                          else if (paymentStatus === 'not_required') { paymentLabel = 'Not Required'; paymentColor = 'text-gray-600'; paymentIcon = <Minus className="inline h-4 w-4 mr-1 text-gray-500" />; }

                          return (
                            <TableRow key={booking._id}>
                              <TableCell>{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : '-'}</TableCell>
                              <TableCell>{booking.bookingTime || '-'}</TableCell>
                              <TableCell>{booking.service?.name || '-'}</TableCell>
                              <TableCell>{booking.provider?.fullName || '-'}</TableCell>
                              <TableCell className={statusColor}>{statusIcon}{statusLabel}</TableCell>
                              <TableCell className={paymentColor}>{paymentIcon}{paymentLabel}</TableCell>
                              <TableCell>{booking.totalPrice ? `$${booking.totalPrice}` : '-'}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
