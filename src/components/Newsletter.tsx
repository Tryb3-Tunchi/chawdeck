import { useState } from 'react';
import Input from './common/Input';
import Button from './common/Button';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // Add newsletter subscription API call here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="bg-primary/5 shadow-md mb- mt-20 py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-gray-600 mb-8">
          Subscribe to our newsletter for exclusive deals and updates
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button
            type="submit"
            disabled={status === 'loading'}
            className="min-w-[120px]"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>

        {status === 'success' && (
          <p className="text-green-600 mt-4 animate-fade-in">
            Thanks for subscribing!
          </p>
        )}
        {status === 'error' && (
          <p className="text-red-600 mt-4 animate-fade-in">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
} 