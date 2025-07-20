import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, MessageSquare, HeadphonesIcon } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/contacts` : 'http://localhost:5000/api/v1/contacts';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Message Sent!',
          description: "Thank you for contacting us. We'll get back to you within 24 hours.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to send message. Please try again.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email anytime',
      value: 'support@localheroes.com',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak with our team',
      value: '(555) 123-4567',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with support',
      value: 'Available 24/7',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: HeadphonesIcon,
      title: 'Support Center',
      description: 'Get instant help',
      value: 'help.localheroes.com',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-brand-50 via-white to-purple-50">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="theme-gradient-primary py-20 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
              Have questions? We'd love to hear from you. Our team is here to help 
              and will respond as quickly as possible.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                Contact Methods
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose the way that works best for you
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-brand-100 text-center group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                    <method.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-gray-600 mb-2 text-sm">{method.description}</p>
                  <p className="text-brand-600 font-medium">{method.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="py-16 theme-gradient-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <Card className="border-brand-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-br from-brand-500 to-purple-600 text-white rounded-t-lg">
                    <CardTitle className="text-2xl">Contact Information</CardTitle>
                    <CardDescription className="text-white/90">
                      Reach out through any of these channels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Email</p>
                        <p className="text-gray-600">support@localheroes.com</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Phone</p>
                        <p className="text-gray-600">(555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Address</p>
                        <p className="text-gray-600">123 Service St, City, State 12345</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Hours</p>
                        <p className="text-gray-600">Mon-Fri: 8AM-8PM<br />Sat-Sun: 9AM-6PM</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="border-brand-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-br from-brand-500 to-purple-600 text-white rounded-t-lg">
                    <CardTitle className="text-2xl">Send us a Message</CardTitle>
                    <CardDescription className="text-white/90">
                      Fill out the form below and we'll get back to you within 24 hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                            Name
                          </label>
                          <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                          </label>
                          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                          Subject
                        </label>
                        <Input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} required />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                          Message
                        </label>
                        <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required rows={4} />
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                          Send Message
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage; 