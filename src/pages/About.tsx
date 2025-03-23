import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold mb-4">About TRYB3-CHAW</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your favorite local restaurants, delivered fast and fresh to your doorstep.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img
            src="/images/about-hero.jpg"
            alt="Food delivery"
            className="rounded-lg shadow-lg w-full h-[400px] object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col justify-center"
        >
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in 2024, TRYB3-CHAW has been connecting hungry customers with the
            best local restaurants. We believe that great food should be accessible
            to everyone, and we're committed to making that happen.
          </p>
          <p className="text-gray-600">
            Our platform partners with top-rated restaurants to ensure you get the
            highest quality meals delivered right to your door. With real-time
            tracking and dedicated support, we make sure your food arrives hot and
            fresh.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
      >
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-primary">🚀</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
          <p className="text-gray-600">
            Average delivery time under 35 minutes
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-primary">🍽️</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Quality Food</h3>
          <p className="text-gray-600">
            Partnered with 500+ top-rated restaurants
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-primary">💝</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Customer First</h3>
          <p className="text-gray-600">
            24/7 customer support and satisfaction guarantee
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center bg-primary/5 rounded-lg p-12"
      >
        <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Whether you're a food lover, restaurant owner, or potential partner,
          we'd love to hear from you. Let's make great food accessible to everyone.
        </p>
        <button className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary-dark transition-colors">
          Partner With Us
        </button>
      </motion.div>
    </div>
  );
} 