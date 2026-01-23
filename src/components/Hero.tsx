import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Soft blurred background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-20 w-[300px] h-[300px] rounded-full bg-muted/50 blur-[80px]" />
        <div className="absolute bottom-20 right-40 w-[200px] h-[200px] rounded-full bg-primary/10 blur-[60px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-foreground mb-6">
              Curated product lists
              <span className="block">for real-life situations.</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Skip endless scrolling. We shortlist exactly what you need—based on where you are and what you're doing.
            </p>

            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-foreground text-background font-medium text-base transition-all duration-300 hover:bg-foreground/90"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
              }}
              aria-label="Scroll to view all curated product lists"
            >
              See all curated lists
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </motion.button>
          </motion.div>

          {/* Right Side - Product Imagery Placeholder */}
          <motion.div
            className="relative hidden lg:flex justify-center items-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            aria-hidden="true"
          >
            <div className="relative w-full max-w-md h-[400px]">
              {/* Decorative product-like shapes */}
              <motion.div 
                className="absolute top-8 left-8 w-24 h-40 bg-gradient-to-b from-primary/30 to-primary/10 rounded-2xl shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-20 bg-accent/40 rounded-full shadow-md"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
              <motion.div 
                className="absolute top-20 right-8 w-16 h-48 bg-gradient-to-b from-muted to-muted/50 rounded-xl shadow-lg"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              <motion.div 
                className="absolute bottom-16 left-16 w-28 h-28 bg-secondary rounded-2xl shadow-md"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
              />
              <motion.div 
                className="absolute bottom-8 right-16 w-32 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade divider */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
