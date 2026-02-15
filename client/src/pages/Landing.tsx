import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Shield, PenTool } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-serif font-bold tracking-tight">Memoir</div>
          <a href="/api/login">
            <Button variant="default" className="shadow-lg shadow-primary/20">Sign In</Button>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-[1.1] mb-6">
              Your life, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                documented.
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
              A minimalist, premium digital diary for those who value clarity. 
              Track your mood, set goals, and reflect on your journey in a distraction-free environment.
            </p>
            <div className="flex gap-4">
              <a href="/api/login">
                <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-xl shadow-primary/25">
                  Start Writing
                </Button>
              </a>
              <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full">
                Learn More
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 bg-secondary/20 backdrop-blur-sm p-4"
          >
            {/* Abstract visual representation of the app UI */}
            <div className="w-full h-full bg-card rounded-xl border border-border/50 shadow-inner p-8 flex flex-col gap-6">
              <div className="w-1/3 h-8 bg-secondary rounded-md" />
              <div className="w-2/3 h-4 bg-secondary/50 rounded-md" />
              <div className="space-y-3 mt-8">
                <div className="w-full h-4 bg-secondary/30 rounded-md" />
                <div className="w-full h-4 bg-secondary/30 rounded-md" />
                <div className="w-4/5 h-4 bg-secondary/30 rounded-md" />
              </div>
              <div className="mt-auto flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10" />
                <div className="w-12 h-12 rounded-full bg-secondary" />
                <div className="w-12 h-12 rounded-full bg-secondary" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Daily Entries", desc: "A clean, beautiful editor for your daily thoughts and reflections." },
              { icon: Shield, title: "Private & Secure", desc: "Your thoughts are yours alone. Encrypted and secure by design." },
              { icon: PenTool, title: "Mood Tracking", desc: "Visualize your emotional journey with insightful charts and stats." },
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all"
              >
                <feature.icon className="w-10 h-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2 font-serif">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 mt-auto border-t border-border/40 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Memoir. All rights reserved.</p>
      </footer>
    </div>
  );
}
