// Simple chat logic for the static VoyageAI demo

const messagesEl = document.getElementById('messages');
const inputForm = document.getElementById('input-form');
const userInput = document.getElementById('user-input');

// Conversation state
const state = {
  step: 'init',
  location: '',
  destination: '',
  preferences: '',
  budget: '',
  dates: ''
};

// Append a message to the chat
function addMessage(text, sender = 'bot') {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  messagesEl.appendChild(msg);
  // scroll to bottom
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Generate a greeting and first question
function startConversation() {
  addMessage("Hello! I'm VoyageAI, your student travel concierge. Let's plan your next adventure.");
  // ask for starting location
  addMessage('First, where are you departing from?');
  state.step = 'ask_location';
}

// Get sample travel options based on user input
function getTravelOptions() {
  // In a real implementation this would call a backend or LLM
  // Here we return a few predefined options with approximate costs
  return [
    {
      destination: 'Berlin',
      transport: 'train',
      price_total: 120,
      accommodation: 'hostel',
      why: 'Berlin offers vibrant nightlife, rich history and student discounts.'
    },
    {
      destination: 'Vienna',
      transport: 'bus',
      price_total: 90,
      accommodation: 'budget hotel',
      why: 'Vienna is known for its culture, museums and classical music scene.'
    },
    {
      destination: 'Munich',
      transport: 'train',
      price_total: 100,
      accommodation: 'hostel',
      why: 'Munich has beautiful parks, breweries and easy day trips to the Alps.'
    }
  ];
}

// Process user input according to the current step
function processInput(input) {
  switch (state.step) {
    case 'ask_location':
      state.location = input;
      addMessage(`Nice! Your starting point is ${input}. Where would you like to go?`);
      state.step = 'ask_destination';
      break;
    case 'ask_destination':
      state.destination = input;
      addMessage('Great choice! Do you have any particular interests or preferences (e.g. nightlife, culture, nature)?');
      state.step = 'ask_preferences';
      break;
    case 'ask_preferences':
      state.preferences = input;
      addMessage('Understood. What is your approximate budget in euros?');
      state.step = 'ask_budget';
      break;
    case 'ask_budget':
      state.budget = input;
      addMessage('Thanks! Finally, what dates are you planning? (e.g. 2025-12-10 to 2025-12-15)');
      state.step = 'ask_dates';
      break;
    case 'ask_dates':
      state.dates = input;
      // Provide recommendations
      const options = getTravelOptions();
      let response = `All set! Here are some options based on your inputs (${state.location} to ${state.destination}, preferences: ${state.preferences}, budget: €${state.budget}, dates: ${state.dates}):\n\n`;
      options.forEach((opt, idx) => {
        response += `${idx + 1}. ${opt.destination} via ${opt.transport}, approx. €${opt.price_total} including ${opt.accommodation}. ${opt.why}\n\n`;
      });
      response += 'Reply with the number of your preferred option.';
      addMessage(response);
      state.step = 'choose_option';
      break;
    case 'choose_option':
      // simple handling: acknowledge choice
      const choice = parseInt(input, 10);
      const opts = getTravelOptions();
      if (!isNaN(choice) && choice >= 1 && choice <= opts.length) {
        const selected = opts[choice - 1];
        addMessage(`Excellent! You chose option ${choice}: ${selected.destination}. I'll add it to your shortlist. Have a wonderful trip!`);
      } else {
        addMessage('Sorry, I didn\'t understand that. Please reply with the number of your preferred option.');
        return;
      }
      // conversation ends
      state.step = 'complete';
      addMessage('If you want to plan another trip, just refresh the page to start over.');
      break;
    default:
      addMessage("Thanks for chatting with VoyageAI! Refresh the page to start a new conversation.");
      break;
  }
}

// Handle form submission
inputForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = userInput.value.trim();
  if (input === '') return;
  addMessage(input, 'user');
  userInput.value = '';
  processInput(input);
});

// Start conversation on load
window.addEventListener('DOMContentLoaded', startConversation);
