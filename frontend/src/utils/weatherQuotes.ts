/**
 * Funny temperature-based quotes for northern cities
 */

interface TempRange {
  min: number;
  max: number;
  quotes: string[];
}

const TEMPERATURE_QUOTES: TempRange[] = [
  {
    min: -Infinity,
    max: -45,
    quotes: [
      "Your eyelashes are freezing shut!",
      "Even polar bears called in sick",
      "The cold has achieved sentience",
      "Spit freezes before it hits the ground",
      "Mars is jealous of this cold",
      "The thermometer gave up",
      "Even ice is complaining",
      "This is just showing off at this point"
    ]
  },
  {
    min: -45,
    max: -35,
    quotes: [
      "Pipes are freezing!",
      "Diesel won't start without a heater",
      "Perfect weather for ice sculptures",
      "The air hurts my face",
      "Car battery season!",
      "Block heater mandatory",
      "Instant frost bite weather",
      "Even the snow is cold"
    ]
  },
  {
    min: -35,
    max: -25,
    quotes: [
      "Classic northern winter",
      "Break out the parka!",
      "Heat trace cable weather",
      "Schools might close soon",
      "Time to test the furnace",
      "Your truck won't like this",
      "Double glove weather",
      "Breath clouds are impressive"
    ]
  },
  {
    min: -25,
    max: -15,
    quotes: [
      "Practically T-shirt weather!",
      "Only one jacket needed",
      "Almost balmy for the North",
      "The locals are smiling",
      "Perfect for a winter walk",
      "Heat wave incoming?",
      "Snowmobiling weather!",
      "Not even that cold, eh?"
    ]
  },
  {
    min: -15,
    max: -5,
    quotes: [
      "Feeling tropical!",
      "Break out the shorts?",
      "Heatwave alert!",
      "Ice cream weather",
      "Basically spring",
      "Too hot to handle",
      "Winter? What winter?",
      "Sunbathing conditions"
    ]
  },
  {
    min: -5,
    max: 5,
    quotes: [
      "Summer has arrived!",
      "Fire up the BBQ!",
      "Beach day vibes",
      "Patio season opens",
      "Practically sweating",
      "AC might be needed soon",
      "Is this even Canada?",
      "Global warming confirmed"
    ]
  },
  {
    min: 5,
    max: Infinity,
    quotes: [
      "Impossibly warm!",
      "The ice is scared",
      "Northern heatwave!",
      "Call the climate scientists",
      "This isn't natural",
      "Swimming hole weather",
      "Legendary warmth",
      "Write this down in history!"
    ]
  }
];

/**
 * Get a random funny quote based on temperature
 */
export const getTemperatureQuote = (temp: number): string => {
  for (const range of TEMPERATURE_QUOTES) {
    if (temp <= range.max && temp > range.min) {
      const randomIndex = Math.floor(Math.random() * range.quotes.length);
      return range.quotes[randomIndex];
    }
  }

  // Fallback
  return "The thermometer is confused";
};
