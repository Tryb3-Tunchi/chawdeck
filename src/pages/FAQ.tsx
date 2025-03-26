export default function FAQ() {
  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Browse restaurants, select items, add to cart, and proceed to checkout. You'll need to be logged in to complete your order.",
    },
    {
      question: "What are the delivery charges?",
      answer:
        "Delivery charges vary based on distance and restaurant. The exact fee will be shown at checkout.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Typical delivery times range from 25-45 minutes depending on distance and order volume.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
