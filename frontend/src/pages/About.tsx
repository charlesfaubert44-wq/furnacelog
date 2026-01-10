import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Home,
  Flame,
  MapPin,
  Wrench,
  Truck,
  Heart,
  Shield,
  Users,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Thermometer,
  Droplet,
  Wind,
  Battery,
} from 'lucide-react';
import SEO from '@/components/seo/SEO';
import { OrganizationSchema } from '@/components/seo/StructuredData';

export const AboutPage: React.FC = () => {
  return (
    <>
      <SEO
        title="About FurnaceLog - Northern Home Maintenance Experts"
        description="Built by northern homeowners for northern homeowners. FurnaceLog helps protect homes in extreme cold climates across Yukon, NWT, and Nunavut. Learn our story and mission."
        keywords="about furnacelog, northern home experts, yellowknife homeowners, canada north maintenance, extreme cold home care"
        url="https://furnacelog.com/about"
        type="website"
      />
      <OrganizationSchema />

      <div className="min-h-screen bg-gradient-to-br from-warm-white via-cream to-warm-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-burnt-sienna/10 via-warm-orange/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-burnt-sienna to-warm-orange shadow-2xl mb-6">
              <Home className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal mb-6 tracking-tight">
              Built for Northern Homes,
              <br />
              <span className="bg-gradient-to-r from-burnt-sienna to-warm-orange bg-clip-text text-transparent">
                By Northern Homeowners
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-warm-gray mb-8 leading-relaxed">
              When maintaining your home means preventing a crisis at -40°C,
              <br className="hidden sm:block" />
              you need software that understands your reality.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
              <Card variant="warm" className="p-6 text-center">
                <div className="text-3xl font-bold text-burnt-sienna mb-1">500+</div>
                <div className="text-sm text-warm-gray">Homes Monitored</div>
              </Card>
              <Card variant="warm" className="p-6 text-center">
                <div className="text-3xl font-bold text-burnt-sienna mb-1">12,000+</div>
                <div className="text-sm text-warm-gray">Maintenance Logs</div>
              </Card>
              <Card variant="warm" className="p-6 text-center">
                <div className="text-3xl font-bold text-burnt-sienna mb-1">50+</div>
                <div className="text-sm text-warm-gray">Communities Served</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card variant="warm" className="overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-burnt-sienna to-warm-orange flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-charcoal">Our Story</h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-warm-gray leading-relaxed mb-4">
                FurnaceLog was born during a <span className="font-semibold text-charcoal">-42°C cold snap in Yellowknife</span> when
                a homeowner's furnace died at 3 AM. Huddled with family in one room with a space heater,
                waiting for a contractor who was 6 hours away, they had a realization:
              </p>

              <p className="text-xl font-medium text-charcoal mb-4 italic border-l-4 border-burnt-sienna pl-6 py-2 bg-burnt-sienna/5">
                "Northern homeowners need better tools to prevent these crises. Not just track when things break,
                but predict, maintain, and share knowledge so the next family doesn't face the same terrifying night."
              </p>

              <p className="text-lg text-warm-gray leading-relaxed">
                We've been there - it's 2 AM, -38°C, and your furnace just quit. Your water line froze.
                Your holding tank needs pumping but the truck can't come until next week.
                These aren't inconveniences in the North - <span className="font-semibold text-charcoal">they're emergencies</span>.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* The Northern Reality Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
            The Northern Reality
          </h2>
          <p className="text-lg text-warm-gray max-w-2xl mx-auto">
            Maintaining a home in the territories comes with unique challenges
            that southern Canada rarely thinks about.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Challenge 1 */}
          <Card variant="warm" className="p-8 text-center hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-warm-coral to-burnt-sienna flex items-center justify-center mb-6 shadow-lg">
              <Thermometer className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-charcoal mb-3">
              When Heating Fails, It's Dangerous
            </h3>
            <p className="text-warm-gray leading-relaxed">
              At -40°C, a furnace failure isn't just uncomfortable - it's a race against frozen pipes,
              structural damage, and family safety. Proactive maintenance isn't optional.
            </p>
          </Card>

          {/* Challenge 2 */}
          <Card variant="warm" className="p-8 text-center hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-burnt-sienna to-warm-orange flex items-center justify-center mb-6 shadow-lg">
              <Wrench className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-charcoal mb-3">
              DIY Isn't Optional
            </h3>
            <p className="text-warm-gray leading-relaxed">
              When contractors are 500km away and booked 3 weeks out, northern homeowners become
              experts by necessity. We're here to help you track what works and when to call for help.
            </p>
          </Card>

          {/* Challenge 3 */}
          <Card variant="warm" className="p-8 text-center hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sage to-burnt-sienna flex items-center justify-center mb-6 shadow-lg">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-charcoal mb-3">
              Unique Systems, High Costs
            </h3>
            <p className="text-warm-gray leading-relaxed">
              Water trucks, holding tanks, heat trace cables, HRV systems - you manage infrastructure
              that most Canadians never think about. Track it all in one place.
            </p>
          </Card>
        </div>
      </section>

      {/* What We Believe Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
            What We Believe
          </h2>
          <p className="text-lg text-warm-gray max-w-2xl mx-auto">
            Our core values guide everything we build.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="warm" className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-burnt-sienna to-warm-orange flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-charcoal mb-2">
                  Knowledge Should Be Free
                </h3>
                <p className="text-warm-gray leading-relaxed">
                  Share maintenance wisdom, not gatekeep it. Every homeowner deserves access to
                  the information that keeps their home safe and warm.
                </p>
              </div>
            </div>
          </Card>

          <Card variant="warm" className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-burnt-sienna to-warm-orange flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-charcoal mb-2">
                  Prevention Over Crisis
                </h3>
                <p className="text-warm-gray leading-relaxed">
                  Track, maintain, and prevent rather than react. A $50 filter change beats a
                  $5,000 furnace replacement every time.
                </p>
              </div>
            </div>
          </Card>

          <Card variant="warm" className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-burnt-sienna to-warm-orange flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-charcoal mb-2">
                  Community Over Competition
                </h3>
                <p className="text-warm-gray leading-relaxed">
                  Northern homeowners help each other. We're building a platform for sharing
                  experiences, tips, and support - not selling against each other.
                </p>
              </div>
            </div>
          </Card>

          <Card variant="warm" className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-burnt-sienna to-warm-orange flex items-center justify-center flex-shrink-0">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-charcoal mb-2">
                  Practical Over Perfect
                </h3>
                <p className="text-warm-gray leading-relaxed">
                  DIY-moderate solutions, not aerospace engineering. If it works at -40°C and
                  you can fix it yourself, it's the right solution.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
            Who We Serve
          </h2>
          <p className="text-lg text-warm-gray max-w-2xl mx-auto">
            FurnaceLog is for every northern homeowner, no matter where you are on your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="warm" className="p-8">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-xl font-bold text-charcoal mb-3">
              The New Homeowner
            </h3>
            <p className="text-warm-gray leading-relaxed mb-4">
              Just bought a modular home in Yellowknife. Overwhelmed by oil deliveries,
              furnace filters, and winterization checklists.
            </p>
            <p className="text-sm text-burnt-sienna font-medium">
              "FurnaceLog helps me track everything so nothing falls through the cracks."
            </p>
          </Card>

          <Card variant="warm" className="p-8">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-xl font-bold text-charcoal mb-3">
              The DIY Expert
            </h3>
            <p className="text-warm-gray leading-relaxed mb-4">
              20 years maintaining an off-grid cabin. You know your systems inside and out,
              but want better records and cost tracking.
            </p>
            <p className="text-sm text-burnt-sienna font-medium">
              "Finally, software that gets it. No fluff, just what I need."
            </p>
          </Card>

          <Card variant="warm" className="p-8">
            <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-xl font-bold text-charcoal mb-3">
              The Busy Parent
            </h3>
            <p className="text-warm-gray leading-relaxed mb-4">
              Balancing work, kids, and keeping the furnace running. You need reminders,
              quick checklists, and peace of mind.
            </p>
            <p className="text-sm text-burnt-sienna font-medium">
              "Set it and forget it until the reminder comes. Perfect."
            </p>
          </Card>
        </div>
      </section>

      {/* Features at a Glance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
            Features Built for the North
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="warm" className="p-6 text-center">
            <Flame className="w-8 h-8 text-burnt-sienna mx-auto mb-3" />
            <h4 className="font-bold text-charcoal mb-2">System Monitoring</h4>
            <p className="text-sm text-warm-gray">Track heating, water, sewage, generators, and more</p>
          </Card>

          <Card variant="warm" className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-burnt-sienna mx-auto mb-3" />
            <h4 className="font-bold text-charcoal mb-2">Cost Tracking</h4>
            <p className="text-sm text-warm-gray">Monitor oil deliveries, pump-outs, and maintenance costs</p>
          </Card>

          <Card variant="warm" className="p-6 text-center">
            <Wind className="w-8 h-8 text-burnt-sienna mx-auto mb-3" />
            <h4 className="font-bold text-charcoal mb-2">Weather Integration</h4>
            <p className="text-sm text-warm-gray">Prepare for cold snaps and seasonal changes</p>
          </Card>

          <Card variant="warm" className="p-6 text-center">
            <Users className="w-8 h-8 text-burnt-sienna mx-auto mb-3" />
            <h4 className="font-bold text-charcoal mb-2">Contractor Directory</h4>
            <p className="text-sm text-warm-gray">Find local help when DIY isn't enough</p>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card variant="warm" className="overflow-hidden">
          <div className="p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-bold text-charcoal mb-4">
              Ready to Take Control of Your Home?
            </h2>
            <p className="text-lg text-warm-gray mb-8">
              Join 500+ northern homeowners tracking, maintaining, and preventing crises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-burnt-sienna to-warm-orange hover:from-burnt-sienna/90 hover:to-warm-orange/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg">
                  Start Tracking Your Home
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="w-full sm:w-auto border-2 border-burnt-sienna text-burnt-sienna hover:bg-burnt-sienna/5 px-8 py-6 text-lg rounded-xl">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
    </>
  );
};
