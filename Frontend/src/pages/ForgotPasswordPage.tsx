
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Mock password reset - replace with your preferred auth solution
      console.log("Reset password for:", values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Password reset email sent!",
        description: "Check your email for instructions to reset your password.",
      });
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10 px-4 min-h-[calc(100vh-64px-300px)] flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-purple-50">
        <Card className="w-full max-w-md shadow-xl border-brand-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">Forgot your password?</CardTitle>
            <CardDescription className="text-center">
              {!isSubmitted 
                ? "Enter your email and we'll send you a link to reset your password" 
                : "Check your email for a link to reset your password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                              placeholder="name@example.com" 
                              className="pl-10 border-brand-200 focus:border-brand-500" 
                              disabled={isLoading} 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white" disabled={isLoading}>
                    {isLoading ? "Sending reset link..." : "Send reset link"}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  We've sent a password reset link to your email address.
                </p>
                <p className="text-muted-foreground">
                  Didn't receive an email? Check your spam folder or try again.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full mt-2 border-brand-200 text-brand-600 hover:bg-brand-50"
                  onClick={() => setIsSubmitted(false)}
                >
                  Try again
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="flex items-center justify-center w-full mt-4">
              <Link 
                to="/login" 
                className="text-sm flex items-center text-brand-600 hover:text-brand-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPasswordPage;
