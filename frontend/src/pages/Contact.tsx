import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Mail,
  MessageSquare,
  Users,
  Wrench,
  MapPin,
  Github,
  CheckCircle,
  Loader2,
  Heart,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SEO from '@/components/seo/SEO';
import { FAQPageSchema } from '@/components/seo/StructuredData';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.enum([
    'general',
    'support',
    'feature',
    'partnership',
    'story',
  ], {
    required_error: 'Please select a subject'
  }),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const subjectOptions = [
  { value: 'general', label: 'General Question' },
  { value: 'support', label: 'Technical Support' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'partnership', label: 'Partnership Inquiry' },
  { value: 'story', label: 'Share My Story' },
];

export const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Call backend API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setIsSubmitted(true);
      reset();
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setSubmitError('Failed to send message. Please try again or email us directly at hello@furnacelog.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How much does FurnaceLog cost?',
      answer: 'FurnaceLog is currently free during our beta period. We believe northern homeowners deserve accessible tools for home maintenance tracking.',
    },
    {
      question: 'Is my home data private and secure?',
      answer: 'Absolutely. Your data is encrypted, stored securely, and never shared with third parties. You own your maintenance logs and can export or delete them anytime.',
    },
    {
      question: 'Do you support homes outside the territories?',
      answer: 'While FurnaceLog is built specifically for northern Canada (NWT, Nunavut, Yukon), it works anywhere. We just focus our features on extreme climate challenges.',
    },
    {
      question: 'Can I export my maintenance logs?',
      answer: 'Yes! Your data is yours. Export your logs anytime in CSV or PDF format for insurance, resale documentation, or personal records.',
    },
    {
      question: 'How do I add a contractor to the directory?',
      answer: 'If you\'re a local contractor, reach out via the Partnership Inquiry form. If you want to recommend a great contractor, use the "Share My Story" option.',
    },
  ];

  return (
    <>
      <SEO
        title="Contact FurnaceLog - Support for Northern Homeowners"
        description="Get in touch with FurnaceLog. Questions about features, technical support, or want to share your story? We're here to help northern homeowners across Canada."
        keywords="contact furnacelog, northern home support, yellowknife help, furnace tracker support, home maintenance assistance"
        url="https://furnacelog.com/contact"
        type="website"
      />
      <FAQPageSchema faqs={faqs} />

      <div className="min-h-screen bg-gradient-to-br from-warm-white via-cream to-warm-white">
        {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-burnt-sienna to-warm-orange shadow-lg mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-charcoal mb-4 tracking-tight">
            We're Here to Help
          </h1>
          <p className="text-xl text-warm-gray leading-relaxed">
            Questions, feedback, or just want to share your northern maintenance story?
            <br className="hidden sm:block" />
            Reach out - we'd love to hear from you.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card variant="warm" className="p-8 text-center hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-burnt-sienna to-warm-orange flex items-center justify-center mb-4">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-2">General Inquiries</h3>
            <p className="text-sm text-warm-gray mb-3">
              Questions about features, pricing, or how FurnaceLog works
            </p>
            <a href="mailto:hello@furnacelog.com" className="text-burnt-sienna hover:text-warm-orange font-medium text-sm">
              hello@furnacelog.com
            </a>
            <p className="text-xs text-warm-gray mt-2">Usually within 24 hours</p>
          </Card>

          <Card variant="warm" className="p-8 text-center hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-burnt-sienna to-warm-orange flex items-center justify-center mb-4">
              <Wrench className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-2">Technical Support</h3>
            <p className="text-sm text-warm-gray mb-3">
              Need help with your account or found a bug?
            </p>
            <a href="mailto:support@furnacelog.com" className="text-burnt-sienna hover:text-warm-orange font-medium text-sm">
              support@furnacelog.com
            </a>
            <p className="text-xs text-warm-coral mt-2 italic">
              For urgent heating issues, call your local contractor!
            </p>
          </Card>

          <Card variant="warm" className="p-8 text-center hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-burnt-sienna to-warm-orange flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-2">Community & Stories</h3>
            <p className="text-sm text-warm-gray mb-3">
              Share your northern home story, DIY tips, or wisdom
            </p>
            <a href="mailto:community@furnacelog.com" className="text-burnt-sienna hover:text-warm-orange font-medium text-sm">
              community@furnacelog.com
            </a>
            <p className="text-xs text-warm-gray mt-2">We love featuring user stories!</p>
          </Card>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card variant="warm" className="overflow-hidden">
          <div className="p-8 sm:p-12">
            {!isSubmitted ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-burnt-sienna to-warm-orange flex items-center justify-center">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal">Send Us a Message</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-2">
                      Name *
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      id="name"
                      placeholder="Your name"
                      className={cn(
                        "w-full px-4 py-3 bg-white border-2 rounded-xl text-charcoal placeholder-warm-gray/50 focus:outline-none transition-colors",
                        errors.name ? 'border-warm-coral' : 'border-soft-amber/30 focus:border-burnt-sienna'
                      )}
                    />
                    {errors.name && (
                      <p className="text-sm text-warm-coral mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                      Email *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      id="email"
                      placeholder="your.email@example.com"
                      className={cn(
                        "w-full px-4 py-3 bg-white border-2 rounded-xl text-charcoal placeholder-warm-gray/50 focus:outline-none transition-colors",
                        errors.email ? 'border-warm-coral' : 'border-soft-amber/30 focus:border-burnt-sienna'
                      )}
                    />
                    {errors.email && (
                      <p className="text-sm text-warm-coral mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-charcoal mb-2">
                      Subject *
                    </label>
                    <select
                      {...register('subject')}
                      id="subject"
                      className={cn(
                        "w-full px-4 py-3 bg-white border-2 rounded-xl text-charcoal focus:outline-none transition-colors",
                        errors.subject ? 'border-warm-coral' : 'border-soft-amber/30 focus:border-burnt-sienna'
                      )}
                    >
                      <option value="">Select a subject...</option>
                      {subjectOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className="text-sm text-warm-coral mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-2">
                      Message *
                    </label>
                    <textarea
                      {...register('message')}
                      id="message"
                      rows={6}
                      placeholder="Tell us what's on your mind..."
                      className={cn(
                        "w-full px-4 py-3 bg-white border-2 rounded-xl text-charcoal placeholder-warm-gray/50 focus:outline-none transition-colors resize-none",
                        errors.message ? 'border-warm-coral' : 'border-soft-amber/30 focus:border-burnt-sienna'
                      )}
                    />
                    {errors.message && (
                      <p className="text-sm text-warm-coral mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Error */}
                  {submitError && (
                    <div className="p-4 bg-warm-coral/10 border-2 border-warm-coral/30 rounded-xl">
                      <p className="text-sm text-warm-coral">{submitError}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-burnt-sienna to-warm-orange hover:from-burnt-sienna/90 hover:to-warm-orange/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-sage to-burnt-sienna flex items-center justify-center mb-6 animate-bounce">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-charcoal mb-3">
                  Message Sent!
                </h3>
                <p className="text-lg text-warm-gray mb-6">
                  Thanks for reaching out! We'll get back to you soon.
                  <br />
                  Stay warm! 🔥
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="border-2 border-burnt-sienna text-burnt-sienna hover:bg-burnt-sienna/5 rounded-xl"
                >
                  Send Another Message
                </Button>
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-charcoal mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-warm-gray">Quick answers to common questions</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} variant="warm" className="overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-burnt-sienna/5 transition-colors"
              >
                <span className="font-semibold text-charcoal pr-4">{faq.question}</span>
                <span className={cn(
                  "text-burnt-sienna transition-transform duration-200 flex-shrink-0",
                  expandedFaq === index && "rotate-180"
                )}>
                  ▼
                </span>
              </button>
              {expandedFaq === index && (
                <div className="px-6 pb-6">
                  <p className="text-warm-gray leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Office/Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card variant="warm" className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <MapPin className="w-6 h-6 text-burnt-sienna flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-charcoal mb-2">Our Location</h3>
                <p className="text-warm-gray leading-relaxed">
                  Remotely operated from <span className="font-semibold text-charcoal">Yellowknife, NWT</span>
                </p>
                <p className="text-sm text-warm-gray mt-2 italic">
                  We work where we live - in homes that face the same challenges yours does.
                </p>
              </div>
            </div>
          </Card>

          <Card variant="warm" className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <Github className="w-6 h-6 text-burnt-sienna flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-charcoal mb-2">Open Source</h3>
                <p className="text-warm-gray leading-relaxed mb-3">
                  FurnaceLog is open source - contribute on GitHub
                </p>
                <a
                  href="https://github.com/furnacelog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-burnt-sienna hover:text-warm-orange font-medium inline-flex items-center gap-1"
                >
                  View on GitHub
                  <span>→</span>
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <Card variant="warm" className="overflow-hidden">
          <div className="p-8 sm:p-10 text-center">
            <Users className="w-12 h-12 text-burnt-sienna mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-charcoal mb-3">
              Partnership Inquiries
            </h2>
            <p className="text-warm-gray mb-6 max-w-2xl mx-auto leading-relaxed">
              Are you a local contractor, northern hardware store, community organization,
              or housing authority? Let's work together to help northern homeowners.
            </p>
            <div className="flex flex-wrap gap-3 justify-center text-sm text-warm-gray">
              <span className="px-4 py-2 bg-burnt-sienna/10 rounded-lg">Local Contractors</span>
              <span className="px-4 py-2 bg-burnt-sienna/10 rounded-lg">Hardware Stores</span>
              <span className="px-4 py-2 bg-burnt-sienna/10 rounded-lg">Housing Authorities</span>
              <span className="px-4 py-2 bg-burnt-sienna/10 rounded-lg">Media & Press</span>
            </div>
          </div>
        </Card>
      </section>
    </div>
    </>
  );
};
