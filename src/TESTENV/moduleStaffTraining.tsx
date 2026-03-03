import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  BookOpen,
  Search,
  Wifi,
  WifiOff,
  X,
  Maximize2,
  Save,
  Coffee,
  Briefcase,
  Utensils,
  Wrench,
  ShieldCheck,
  CheckCircle,
  Circle,
  Folder,
  FileText,
  ClipboardList,
  Plus,
  Trash2,
  Upload,
  Settings,
  Edit2,
  Heart,
  Truck,
  Sun,
  Droplet,
  AlertTriangle,
  Users,
  ArrowUp,
  Award,
  AlertCircle,
  CheckSquare,
  Bell
} from 'lucide-react';

// --- CONSTANTS ---
const COLORS = [
  { label: 'Red', value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Yellow', value: '#eab308' },
  { label: 'Green', value: '#22c55e' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Cyan', value: '#06b6d4' },
  { label: 'Magenta', value: '#d946ef' },
  { label: 'Black', value: '#000000' },
  { label: 'Gray', value: '#6b7280' },
  { label: 'White', value: '#ffffff' },
];

const INITIAL_WEEKLY_FOCUS = {
  title: "Weekly Focus: High Season Prep",
  text: "With the holiday rush approaching, please review the 'Guest Relations' section regarding VIP Arrival protocols. Ensure all Welcome Amenities are double-checked.",
  color: "#f97316"
};

// --- MOCK DATA ---
const INITIAL_DATA = [
  // 1. MISSION & CULTURE
  {
    id: 'dept_mvp',
    title: 'MVP: Mission, Vision, Purpose',
    icon: 'Heart',
    type: 'department',
    children: [
      {
        id: 'cat_core_values',
        title: 'Core Values',
        type: 'category',
        items: [
          {
            id: 'task_vision',
            title: 'Our Vision: The Sanctuary',
            lastUpdated: '2024-01-15',
            images: ['vision_sunset'],
            color: '#3b82f6',
            content: {
              summary: 'To be the sanctuary of choice in Nayarit, where nature and luxury coexist seamlessly.',
              instructions: 'We are not just selling a bed to sleep in; we are selling a feeling. The feeling of being completely disconnected from the chaos of the world. \n\n**Key Actions:**\n- Lower your voice in common areas.\n- Walk softly.\n- Anticipate needs before they are spoken.',
              enableChecklist: false,
              requirementsTitle: 'Key Principles',
              requirements: [
                { name: 'Silence', amount: 'Golden' },
                { name: 'Nature', amount: 'Priority' }
              ],
              steps: [
                'We honor the land of Limoncito Hills.',
                'We provide "Invisible Service" - present when needed, invisible when not.',
                'We maintain the legacy of Angela through impeccable standards.'
              ]
            }
          },
          {
            id: 'task_purpose',
            title: 'Our Purpose',
            lastUpdated: '2024-01-15',
            color: '#3b82f6',
            content: {
              summary: 'Honoring the legacy of the property while delivering a VIP experience.',
              instructions: '',
              enableChecklist: false,
              requirementsTitle: '',
              requirements: [],
              steps: [
                'Protect the investment of the estate.',
                'Ensure guests feel like family, not customers.',
                'Operate with integrity during the transition period.'
              ]
            }
          }
        ]
      }
    ]
  },
  // 2. GUEST RELATIONS
  {
    id: 'dept_guest',
    title: 'Guest Relations & Reservations',
    icon: 'Briefcase',
    type: 'department',
    children: [
      {
        id: 'cat_checkin',
        title: 'Arrival Protocols',
        type: 'category',
        items: [
          {
            id: 'task_vip_arrival',
            title: 'VIP Arrival (Maracuya Standard)',
            lastUpdated: '2023-11-15',
            images: ['vip_amenity'],
            color: '#8b5cf6',
            content: {
              summary: 'Standard operating procedure for all direct bookings and VIP guests.',
              instructions: 'The first impression is the only impression that matters. \n\n**Pre-Arrival:**\nEnsure the A/C has been running for at least 2 hours. The villa must smell fresh (use the Lemongrass spray). \n\n**The Greeting:**\nDo not wait behind a desk. Meet them at the car door. Open the door for them.',
              enableChecklist: true,
              requirementsTitle: 'Amenity Setup',
              requirements: [
                { name: 'Fruit Basket (Type B)', amount: '1 Unit' },
                { name: 'Handwritten Note', amount: '1 Card' },
                { name: 'Sparkling Water', amount: '2 Bottles' },
                { name: 'Cold Towels', amount: 'Per Guest' }
              ],
              steps: [
                'Verify arrival time via WhatsApp 24 hours prior.',
                'A/C in Main Villa set to 22°C 2 hours before arrival.',
                'Music system playing "Lounge" playlist at volume 15%.',
                'Greet guests at the main parking area (not the villa door).',
                'Escort to property; luggage handled immediately by staff.',
                'In-villa check-in via tablet; no standing at a counter.'
              ]
            }
          }
        ]
      },
      {
        id: 'cat_concierge',
        title: 'Concierge',
        type: 'category',
        items: [
          {
            id: 'task_whatsapp',
            title: 'WhatsApp Communication',
            lastUpdated: '2023-12-10',
            color: '#22c55e',
            content: {
              summary: 'We use WhatsApp for 90% of guest comms. Tone must be professional yet warm.',
              instructions: '',
              enableChecklist: false,
              requirementsTitle: 'Response Time',
              requirements: [{ name: 'Max Delay', amount: '5 Mins' }],
              steps: [
                'Always start with "Hola [Guest Name]".',
                'Use correct grammar; avoid excessive emojis.',
                'If a request is "No", offer an alternative. Never just say "No".'
              ]
            }
          }
        ]
      }
    ]
  },
  // 3. FOOD & BEVERAGE
  {
    id: 'dept_fb',
    title: 'Food & Beverage',
    icon: 'Utensils',
    type: 'department',
    children: [
      {
        id: 'cat_cien_ballenas',
        title: 'CIEN BALLENAS Restaurant',
        type: 'category',
        items: [
          {
            id: 'task_opening',
            title: 'Opening Procedures',
            lastUpdated: '2024-01-20',
            color: '#f97316',
            content: {
              summary: 'Daily setup for the beach restaurant.',
              instructions: 'Hygiene is paramount. The beach wind carries dust, so all surfaces must be wiped down immediately before service begins.',
              enableChecklist: true,
              requirementsTitle: 'Checklist',
              requirements: [],
              steps: [
                'Sweep terrace and wipe down all tables with sanitizing solution.',
                'Check gas levels for the grill.',
                'Harvest fresh mint and basil from the herb garden.',
                'Ensure the "Catch of the Day" board is updated.'
              ]
            }
          },
          {
            id: 'task_margarita',
            title: 'Signature Spicy Margarita',
            lastUpdated: '2023-12-01',
            images: ['margarita'],
            color: '#eab308',
            content: {
              summary: 'The resort signature drink. MUST be served in the cactus glass.',
              instructions: 'Consistency is key. Measure every pour. The garnish should be placed gently, not thrown in.',
              enableChecklist: false,
              requirementsTitle: 'Ingredients',
              requirements: [
                { name: 'Tequila Reposado', amount: '2 oz' },
                { name: 'Fresh Lime Juice', amount: '1 oz' },
                { name: 'Agave Syrup', amount: '0.5 oz' },
                { name: 'Jalapeño', amount: '2 slices' },
                { name: 'Tajín', amount: 'Rim' }
              ],
              steps: [
                'Rim glass with Tajín.',
                'Muddle jalapeño in shaker.',
                'Add liquids and ice. Shake vigorously.',
                'Double strain. Garnish with dehydrated lime.'
              ]
            }
          }
        ]
      },
      {
        id: 'cat_villa_stock',
        title: 'Villa Provisioning',
        type: 'category',
        items: [
          {
            id: 'task_welcome_fridge',
            title: 'Welcome Fridge Setup',
            lastUpdated: '2024-02-01',
            color: '#3b82f6',
            content: {
              summary: 'Basic items provided for every booking over 3 nights.',
              instructions: 'Arrange items with labels facing forward (FIFO method).',
              enableChecklist: true,
              requirementsTitle: 'Items',
              requirements: [
                { name: 'Pacifico Beer', amount: '6 Pack' },
                { name: 'Milk (Lala)', amount: '1 Liter' },
                { name: 'Eggs', amount: '6 Units' },
                { name: 'Salsa Casera', amount: '1 Jar' }
              ],
              steps: [
                'Ensure items are placed neatly.',
                'Check expiration dates.',
                'Beers must be cold upon arrival.'
              ]
            }
          }
        ]
      }
    ]
  },
  // 4. HOUSEKEEPING
  {
    id: 'dept_hk',
    title: 'Housekeeping',
    icon: 'Coffee',
    type: 'department',
    children: [
      {
        id: 'cat_cleaning',
        title: 'Villa Cleaning',
        type: 'category',
        items: [
          {
            id: 'task_eco_chems',
            title: 'Eco-Chemical Usage',
            lastUpdated: '2023-10-10',
            color: '#22c55e',
            content: {
              summary: 'We use biodegradable products to protect our septic system.',
              instructions: 'Chemicals are expensive and powerful. Use the measuring cups provided.',
              enableChecklist: false,
              requirementsTitle: 'Approved Products',
              requirements: [
                { name: 'Vinegar Mix', amount: 'Windows' },
                { name: 'Bio-Degreaser', amount: 'Kitchen' }
              ],
              steps: [
                'Do not use Bleach (Cloro) unless authorized by Manager.',
                'Dilute concentrates according to the chart in the laundry room.'
              ]
            }
          },
          {
            id: 'task_turndown',
            title: 'Turn-Down Service',
            lastUpdated: '2023-11-05',
            color: '#8b5cf6',
            content: {
              summary: 'Provided for VIPs and upon request.',
              instructions: '',
              enableChecklist: true,
              requirementsTitle: 'Items',
              requirements: [
                { name: 'Chocolate', amount: '1 per pillow' },
                { name: 'Water Glass', amount: 'Bedside' }
              ],
              steps: [
                'Close blackout curtains.',
                'Turn on bedside lamps.',
                'Place slippers by the bed.',
                'Spray lavender mist (1 pump only).'
              ]
            }
          }
        ]
      }
    ]
  },
  // 5. MAINTENANCE & INFRASTRUCTURE
  {
    id: 'dept_maint',
    title: 'Maintenance & Infrastructure',
    icon: 'Wrench',
    type: 'department',
    children: [
      {
        id: 'cat_routine',
        title: 'Routine Checks',
        type: 'category',
        items: [
          {
            id: 'task_ac_maint',
            title: 'A/C Filter Cleaning',
            lastUpdated: '2024-01-05',
            color: '#3b82f6',
            content: {
              summary: 'Must be done bi-weekly due to tropical humidity and dust.',
              instructions: 'If the filters are torn, replace them immediately. Do not reinstall damaged filters.',
              enableChecklist: true,
              requirementsTitle: 'Tools',
              requirements: [
                { name: 'Ladder', amount: '1' },
                { name: 'Vacuum', amount: 'Handheld' }
              ],
              steps: [
                'Turn off breaker.',
                'Remove filters carefully.',
                'Wash with water hose (gentle pressure).',
                'Apply anti-fungal spray.',
                'Dry completely before reinstalling.'
              ]
            }
          },
          {
            id: 'task_water_pressure',
            title: 'Water Cistern Check',
            lastUpdated: '2024-02-10',
            color: '#06b6d4',
            content: {
              summary: 'Ensure main cisterns are filling correctly from the municipal line.',
              instructions: '',
              enableChecklist: true,
              requirementsTitle: '',
              requirements: [],
              steps: [
                'Check float valve functionality.',
                'Inspect pump pressure gauge (should read 40psi).',
                'Report any unusual noise from the hydropneumatic pump.'
              ]
            }
          }
        ]
      }
    ]
  },
  // 6. POOLS
  {
    id: 'dept_pools',
    title: 'Pools',
    icon: 'Droplet',
    type: 'department',
    children: [
      {
        id: 'cat_pool_daily',
        title: 'Daily Maintenance',
        type: 'category',
        items: [
          {
            id: 'task_ph_levels',
            title: 'Chemistry Balance',
            lastUpdated: '2024-01-12',
            color: '#06b6d4',
            content: {
              summary: 'High heat requires higher chlorine monitoring.',
              instructions: 'Never mix chemicals. Add them one by one with 15 minutes in between.',
              enableChecklist: true,
              requirementsTitle: 'Targets',
              requirements: [
                { name: 'pH', amount: '7.4 - 7.6' },
                { name: 'Chlorine', amount: '1.0 - 3.0 ppm' }
              ],
              steps: [
                'Test water at 8:00 AM daily.',
                'Add chemicals into the skimmer, never directly into the pool.',
                'Run pump for 2 hours after adding chemicals.'
              ]
            }
          },
          {
            id: 'task_skimming',
            title: 'Skimming & Vacuuming',
            lastUpdated: '2023-11-20',
            color: '#06b6d4',
            content: {
              summary: 'Keep surface clear of jungle debris.',
              instructions: '',
              enableChecklist: false,
              requirementsTitle: '',
              requirements: [],
              steps: [
                'Skim surface first.',
                'Brush walls to prevent algae.',
                'Vacuum floor (waste setting if heavy dirt, filter setting if light).'
              ]
            }
          }
        ]
      }
    ]
  },
  // 7. GROUNDS & LANDSCAPING
  {
    id: 'dept_grounds',
    title: 'Grounds & Landscaping',
    icon: 'Sun',
    type: 'department',
    children: [
      {
        id: 'cat_permaculture',
        title: 'Permaculture',
        type: 'category',
        items: [
          {
            id: 'task_harvest',
            title: 'Fruit Harvest Protocol',
            lastUpdated: '2024-02-15',
            color: '#22c55e',
            content: {
              summary: 'We harvest Mango, Jackfruit, and Bananas for guest baskets.',
              instructions: 'Do not damage the tree when picking. Use the proper pole tool.',
              enableChecklist: false,
              requirementsTitle: 'Tools',
              requirements: [{ name: 'Basket', amount: '1' }, { name: 'Picker', amount: 'Pole' }],
              steps: [
                'Harvest only ripe fruit or fruit ready to ripen.',
                'Wash immediately to remove sap.',
                'Deliver to F&B kitchen for inspection.',
                'Compost any fallen/rotten fruit to prevent pests.'
              ]
            }
          }
        ]
      },
      {
        id: 'cat_landscaping',
        title: 'General Landscaping',
        type: 'category',
        items: [
          {
            id: 'task_irrigation',
            title: 'Dry Season Watering',
            lastUpdated: '2024-01-01',
            color: '#eab308',
            content: {
              summary: 'November to May requires careful water management.',
              instructions: '',
              enableChecklist: true,
              requirementsTitle: 'Schedule',
              requirements: [{ name: 'Time', amount: 'Before 9 AM' }],
              steps: [
                'Water roots, not leaves, to prevent scorching.',
                'Prioritize the bougainvillea at the entrance.',
                'Check drip lines for iguana damage.'
              ]
            }
          }
        ]
      }
    ]
  },
  // 8. SECURITY
  {
    id: 'dept_security',
    title: 'Security',
    icon: 'ShieldCheck',
    type: 'department',
    children: [
      {
        id: 'cat_access',
        title: 'Access Control',
        type: 'category',
        items: [
          {
            id: 'task_gate',
            title: 'Main Gate Protocol',
            lastUpdated: '2023-10-30',
            color: '#ef4444',
            content: {
              summary: 'Strict control of non-residents.',
              instructions: 'Politeness is compatible with firmness. \n"Welcome to Limoncito Hills" should be the first phrase.',
              enableChecklist: true,
              requirementsTitle: 'Logbook',
              requirements: [],
              steps: [
                'Stop all vehicles.',
                'Ask for destination (Villa Name).',
                'Radio the Villa to confirm expectation of guest.',
                'Take photo of license plate.',
                'Lift barrier only after confirmation.'
              ]
            }
          }
        ]
      },
      {
        id: 'cat_patrol',
        title: 'Patrols',
        type: 'category',
        items: [
          {
            id: 'task_night_patrol',
            title: 'Night Patrol: Jungle Perimeter',
            lastUpdated: '2023-11-12',
            color: '#1e293b',
            content: {
              summary: 'Ensure perimeter fence is intact and no unauthorized entry from beach.',
              instructions: '',
              enableChecklist: true,
              requirementsTitle: 'Gear',
              requirements: [{ name: 'Flashlight', amount: 'High Lumen' }, { name: 'Radio', amount: 'Ch 1' }],
              steps: [
                'Walk the beach perimeter every hour.',
                'Check the pump room locks.',
                'Look for signs of wildlife intrusion (jaguars/boars).',
                'Report any burnt-out lights immediately.'
              ]
            }
          }
        ]
      }
    ]
  },
  // 9. EMERGENCIES
  {
    id: 'dept_emergency',
    title: 'Emergencies',
    icon: 'AlertTriangle',
    type: 'department',
    children: [
      {
        id: 'cat_natural',
        title: 'Natural Disasters',
        type: 'category',
        items: [
          {
            id: 'task_hurricane',
            title: 'Hurricane Prep (Level Yellow)',
            lastUpdated: '2023-09-01',
            color: '#f97316',
            content: {
              summary: 'To be enacted when a storm is 48 hours out.',
              instructions: 'Do not panic. Follow the checklist methodically.',
              enableChecklist: true,
              requirementsTitle: 'Supplies',
              requirements: [{ name: 'Plywood', amount: 'Stock' }, { name: 'Fuel', amount: 'Generator' }],
              steps: [
                'Secure all outdoor furniture (pool chairs, umbrellas) into the storage bodega.',
                'Lower storm shutters on all villas.',
                'Fill generator diesel tank.',
                'Ensure satellite phones are charged.',
                'Inform guests of safety protocol.'
              ]
            }
          },
          {
            id: 'task_wildlife',
            title: 'Scorpion/Snake Bite',
            lastUpdated: '2023-12-05',
            color: '#ef4444',
            content: {
              summary: 'Immediate response protocol.',
              instructions: '',
              enableChecklist: false,
              requirementsTitle: 'Emergency Kit',
              requirements: [{ name: 'Anti-venom', amount: 'Fridge' }],
              steps: [
                'Keep victim calm and immobile.',
                'Take a photo of the animal if safe to do so.',
                'Call La Cruz Medical Center immediately.',
                'Transport guest using the Resort SUV, do not wait for ambulance if minor.'
              ]
            }
          }
        ]
      }
    ]
  },
  // 10. LOGISTICS
  {
    id: 'dept_logistics',
    title: 'Transportation & Logistics',
    icon: 'Truck',
    type: 'department',
    children: [
      {
        id: 'cat_supply',
        title: 'Supply Runs',
        type: 'category',
        items: [
          {
            id: 'task_costco',
            title: 'Weekly Run (PV/Bahia)',
            lastUpdated: '2024-02-18',
            color: '#8b5cf6',
            content: {
              summary: 'Tuesdays are for Costco, Sams, and La Comer.',
              instructions: 'Double check the "Requested Items" list from the Villa tablets before leaving.',
              enableChecklist: true,
              requirementsTitle: 'Stops',
              requirements: [
                { name: 'Costco', amount: 'Bulk' },
                { name: 'La Comer', amount: 'Gourmet' },
                { name: 'Home Depot', amount: 'Maint' }
              ],
              steps: [
                'Check inventory lists from Housekeeping and F&B on Monday.',
                'Take cooler bags for frozen items.',
                'Keep receipts separated by department.',
                'Fuel the van at the gas station in Bucerias.'
              ]
            }
          }
        ]
      },
      {
        id: 'cat_waste',
        title: 'Waste Management',
        type: 'category',
        items: [
          {
            id: 'task_sorting',
            title: 'Separation Protocol',
            lastUpdated: '2023-11-30',
            color: '#22c55e',
            content: {
              summary: 'Strict separation required for eco-certification.',
              instructions: '',
              enableChecklist: false,
              requirementsTitle: 'Bins',
              requirements: [
                { name: 'Green', amount: 'Organic' },
                { name: 'Blue', amount: 'Recycle' },
                { name: 'Grey', amount: 'Landfill' }
              ],
              steps: [
                'Organics go to the compost pile behind the nursery.',
                'Flatten all cardboard boxes.',
                'Glass bottles must be rinsed before recycling bin.',
                'Do NOT put hazardous waste (batteries/paint) in general trash.'
              ]
            }
          }
        ]
      }
    ]
  },
  // 11. HR & STAFF
  {
    id: 'dept_hr',
    title: 'HR, Work Ethic & Rules',
    icon: 'Users',
    type: 'department',
    children: [
      {
        id: 'cat_rules',
        title: 'Rules & Regulations',
        type: 'category',
        items: [
          {
            id: 'task_punctuality',
            title: 'Punctuality & Transport',
            lastUpdated: '2024-01-10',
            color: '#6b7280',
            content: {
              summary: 'Staff shuttle departs La Cruz plaza promptly.',
              instructions: '',
              enableChecklist: false,
              requirementsTitle: '',
              requirements: [],
              steps: [
                'Shuttle leaves La Cruz at 7:30 AM.',
                'If you miss the shuttle, you must arrange your own transport.',
                'Clock in using the fingerprint scanner at the security gate.'
              ]
            }
          },
          {
            id: 'task_conflicts',
            title: 'Conflict Resolution',
            lastUpdated: '2024-01-10',
            color: '#d946ef',
            content: {
              summary: 'Internal disputes must be handled privately.',
              instructions: '',
              enableChecklist: false,
              requirementsTitle: '',
              requirements: [],
              steps: [
                'Never argue in front of guests.',
                'Report issues to the Manager immediately.',
                'Respect the hierarchy; follow instructions from senior staff.'
              ]
            }
          }
        ]
      }
    ]
  }
];

// --- UTILITIES ---

const getPlaceholderImage = (type, width = 600, height = 400) => {
  if (type && type.startsWith('data:image')) return type;

  const colors = {
    vip: 'e0e7ff',
    margarita: 'fef3c7',
    vision: 'dbeafe',
    cleaning: 'dcfce7',
    pool: 'cffafe',
    hurricane: 'ffedd5'
  };

  const safeType = (type && typeof type === 'string') ? type : 'default';
  const baseKey = Object.keys(colors).find(k => safeType.startsWith(k)) || safeType;
  const color = colors[safeType] || colors[baseKey] || 'e2e8f0';

  return `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect fill='%23${color}' width='${width}' height='${height}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23475569'%3E${safeType.toUpperCase()}%3C/text%3E%3C/svg%3E`;
};

// Flatten data helper for "Next Task" logic
const flattenTasks = (data) => {
  const tasks = [];
  data.forEach(dept => {
    dept.children.forEach(cat => {
      cat.items.forEach(item => {
        tasks.push({
          ...item,
          deptId: dept.id,
          catId: cat.id
        });
      });
    });
  });
  return tasks;
};

// Custom Scroll to element (accounting for header height)
const scrollToElement = (ref) => {
  if (ref && ref.current) {
    const yOffset = -90; // Header height (~80px) + padding
    const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};


// --- COMPONENTS ---

const CompletionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform scale-100 transition-all">
        <div className="bg-green-600 p-6 flex flex-col items-center justify-center text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <Award size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold">Training Complete!</h2>
          <p className="text-green-100 mt-2">All current modules have been reviewed.</p>
        </div>
        <div className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-800">Continuous Learning</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Please remember that training is continuous. New modules are added regularly, and existing protocols may be updated.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800 font-medium">
            "Repetition becomes memory. Excellence is a habit, not an act."
          </div>
          <p className="text-xs text-gray-400">
            Check back weekly for new "NEW" flagged items.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg transition-transform transform hover:scale-[1.02]"
          >
            Acknowledge & Finish
          </button>
        </div>
      </div>
    </div>
  );
};

// 1. Entry Modal
const EntryModal = ({ isOpen, onClose, departments, onSave, onDelete, onMoveUp, initialData }) => {
  const [formData, setFormData] = useState({
    id: null,
    deptId: '',
    newDeptTitle: '',
    catId: '',
    newCatTitle: '',
    title: '',
    summary: '',
    instructions: '',
    images: [],
    requirementsTitle: 'Required Materials',
    requirements: [],
    steps: [],
    enableChecklist: false,
    color: '#e5e7eb'
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        let foundDeptId = '';
        let foundCatId = '';
        departments.forEach(d => {
          d.children.forEach(c => {
            if (c.items.some(i => i.id === initialData.id)) {
              foundDeptId = d.id;
              foundCatId = c.id;
            }
          });
        });

        setFormData({
          id: initialData.id,
          deptId: foundDeptId,
          newDeptTitle: '',
          catId: foundCatId,
          newCatTitle: '',
          title: initialData.title,
          summary: initialData.content.summary,
          instructions: initialData.content.instructions || '',
          images: initialData.images || [],
          requirementsTitle: initialData.content.requirementsTitle || 'Required Materials',
          requirements: initialData.content.requirements || [],
          steps: initialData.content.steps || [],
          enableChecklist: initialData.content.enableChecklist || false,
          color: initialData.color || '#e5e7eb'
        });
      } else {
        setFormData({
          id: null,
          deptId: departments[0]?.id || '',
          newDeptTitle: '',
          catId: '',
          newCatTitle: '',
          title: '',
          summary: '',
          instructions: '',
          images: [],
          requirementsTitle: 'Required Materials',
          requirements: [{ name: '', amount: '' }],
          steps: [''],
          enableChecklist: false,
          color: '#e5e7eb'
        });
      }
    }
  }, [isOpen, initialData, departments]);

  if (!isOpen) return null;

  const isEditMode = !!formData.id;
  const selectedDept = departments.find(d => d.id === formData.deptId);
  const categories = selectedDept ? selectedDept.children : [];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.summary) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-slideUp">
        <div className="bg-blue-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-blue-300" />
            <h2 className="font-bold text-lg">{isEditMode ? 'Edit SOP' : 'Add SOP'}</h2>
          </div>
          <button onClick={onClose} className="hover:bg-blue-800 p-1 rounded-full"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department</label>
              <select
                className="w-full p-2 border rounded-lg bg-gray-50"
                value={formData.deptId}
                onChange={e => setFormData({ ...formData, deptId: e.target.value, catId: '' })}
                disabled={isEditMode}
              >
                {departments.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                {!isEditMode && <option value="new">+ Create New Department</option>}
              </select>
              {formData.deptId === 'new' && (
                <input
                  type="text"
                  className="w-full mt-2 p-2 border rounded bg-blue-50 border-blue-200"
                  placeholder="New Department Name"
                  value={formData.newDeptTitle}
                  onChange={e => setFormData({ ...formData, newDeptTitle: e.target.value })}
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
              <select
                className="w-full p-2 border rounded-lg bg-gray-50"
                value={formData.catId}
                onChange={e => setFormData({ ...formData, catId: e.target.value })}
                disabled={isEditMode}
              >
                <option value="">Select Category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                <option value="new">+ Create New Category</option>
              </select>
              {formData.catId === 'new' && (
                <input
                  type="text"
                  className="w-full mt-2 p-2 border rounded bg-blue-50 border-blue-200"
                  placeholder="New Category Name"
                  value={formData.newCatTitle}
                  onChange={e => setFormData({ ...formData, newCatTitle: e.target.value })}
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Color Code</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button
                  key={c.value}
                  onClick={() => setFormData({ ...formData, color: c.value })}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${formData.color === c.value ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-110'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Procedure Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. Locking the Main Gate"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Summary / Context</label>
              <textarea
                className="w-full p-2 border rounded-lg h-20"
                placeholder="Why is this task important?"
                value={formData.summary}
                onChange={e => setFormData({ ...formData, summary: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Images</label>
            <div className="flex gap-2 mb-2 items-center">
              <label className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 cursor-pointer flex items-center gap-2 text-sm">
                <Upload size={16} /> Upload Image(s)
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {formData.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={getPlaceholderImage(img, 64, 40)} className="w-16 h-10 object-cover rounded border" alt="preview" />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="mb-2">
                <label className="block text-[10px] font-bold text-yellow-600 uppercase mb-1">List Header</label>
                <input
                  type="text"
                  className="w-full bg-white border border-yellow-200 rounded p-2 text-xs font-bold text-yellow-800 uppercase focus:outline-none focus:ring-1 focus:ring-yellow-400 placeholder-yellow-300"
                  value={formData.requirementsTitle}
                  onChange={e => setFormData({ ...formData, requirementsTitle: e.target.value })}
                  placeholder="e.g. REQUIRED MATERIALS"
                />
              </div>
              <div className="space-y-2">
                {formData.requirements.map((req, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input type="text" placeholder="Item" className="flex-[2] p-1.5 border rounded text-xs" value={req.name} onChange={e => { const n = [...formData.requirements]; n[idx].name = e.target.value; setFormData({ ...formData, requirements: n }); }} />
                    <input type="text" placeholder="Qty" className="flex-1 p-1.5 border rounded text-xs" value={req.amount} onChange={e => { const n = [...formData.requirements]; n[idx].amount = e.target.value; setFormData({ ...formData, requirements: n }); }} />
                    <button onClick={() => setFormData(prev => ({ ...prev, requirements: prev.requirements.filter((_, i) => i !== idx) }))}><Trash2 size={14} className="text-red-400" /></button>
                  </div>
                ))}
                <button onClick={() => setFormData(prev => ({ ...prev, requirements: [...prev.requirements, { name: '', amount: '' }] }))} className="text-xs text-blue-600 font-bold flex items-center gap-1 mt-1"><Plus size={14} /> Add Row</button>
              </div>
            </div>

            {/* INSTRUCTIONS FIELD WITH REACT-MARKDOWN */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Detailed Instructions</label>
              <div className="relative">
                <textarea
                  className="w-full p-3 border rounded-lg h-32 font-mono text-sm bg-gray-50"
                  placeholder="Detailed instructions (supports Markdown)..."
                  value={formData.instructions}
                  onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                />
                <div className="absolute right-2 bottom-2 text-[10px] text-gray-400">Markdown-friendly</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Procedure Steps</label>
              <div className="space-y-2">
                {formData.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <span className="text-xs mt-2 text-gray-400">{idx + 1}.</span>
                    <textarea className="flex-1 p-2 border rounded text-sm h-14" value={step} onChange={e => { const n = [...formData.steps]; n[idx] = e.target.value; setFormData({ ...formData, steps: n }); }} />
                    <button onClick={() => setFormData(prev => ({ ...prev, steps: prev.steps.filter((_, i) => i !== idx) }))} className="mt-2"><Trash2 size={14} className="text-red-400" /></button>
                  </div>
                ))}
                <button onClick={() => setFormData(prev => ({ ...prev, steps: [...prev.steps, ''] }))} className="text-xs text-blue-600 font-bold flex items-center gap-1 mt-1"><Plus size={14} /> Add Step</button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 mt-4">
            <input type="checkbox" id="enableChecklist" className="w-5 h-5" checked={formData.enableChecklist} onChange={e => setFormData({ ...formData, enableChecklist: e.target.checked })} />
            <label htmlFor="enableChecklist" className="text-sm font-medium text-gray-700">Enable Checkbox Mode</label>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="flex gap-2">
            {isEditMode && onDelete && (
              <button onClick={() => { if (confirm('Delete this entry?')) { onDelete(formData.id); onClose(); } }} className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded">
                <Trash2 size={16} /> Delete
              </button>
            )}
            {isEditMode && onMoveUp && (
              <button onClick={() => { onMoveUp(formData.id); }} className="text-gray-500 hover:text-blue-600 text-sm font-bold flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded">
                <ArrowUp size={16} /> Move Up
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 flex items-center gap-2">
              <Save size={18} /> {isEditMode ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WeeklyFocusModal = ({ isOpen, onClose, data, onSave }) => {
  const [formData, setFormData] = useState(data);
  useEffect(() => { if (isOpen) setFormData(data); }, [isOpen, data]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden p-6 space-y-4">
        <h3 className="font-bold text-lg text-gray-800">Edit Weekly Focus</h3>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
          <input type="text" className="w-full p-2 border rounded" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message</label>
          <textarea className="w-full p-2 border rounded h-24" value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(c => (
              <button key={c.value} onClick={() => setFormData({ ...formData, color: c.value })}
                className={`w-6 h-6 rounded-full border-2 ${formData.color === c.value ? 'border-black scale-110' : 'border-transparent'}`} style={{ backgroundColor: c.value }} />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-500">Cancel</button>
          <button onClick={() => { onSave(formData); onClose(); }} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

const ImageModal = ({ src, alt, onClose }) => {
  const [scale, setScale] = useState(1);
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = 'unset'; }; }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 p-2 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-4xl max-h-screen overflow-hidden flex flex-col items-center">
        <div className="absolute top-4 right-4 z-50 flex gap-4">
          <button onClick={(e) => { e.stopPropagation(); setScale(prev => prev === 1 ? 2.5 : 1); }} className="p-2 bg-white/20 rounded-full text-white backdrop-blur-md"><Maximize2 size={24} /></button>
          <button onClick={onClose} className="p-2 bg-white/20 rounded-full text-white backdrop-blur-md"><X size={24} /></button>
        </div>
        <div className="overflow-auto max-h-[80vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <img src={src} alt={alt} className="object-contain max-w-full rounded-lg transition-transform duration-200" style={{ transform: `scale(${scale})`, cursor: scale === 1 ? 'zoom-in' : 'zoom-out' }} onClick={() => setScale(prev => prev === 1 ? 2.5 : 1)} />
        </div>
      </div>
    </div>
  );
};

const TaskAccordion = ({ item, isOpen, onToggle, isAdmin, onEdit, isTrainingMode, isCompleted, onCompleteAndNext }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState(new Set());
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  // Ref to scroll into view when opened in training mode
  const taskRef = useRef(null);

  useEffect(() => {
    if (isOpen && isTrainingMode && taskRef.current) {
      setTimeout(() => {
        scrollToElement(taskRef);
      }, 300); // Slight delay for animation
    }
  }, [isOpen, isTrainingMode]);

  const images = useMemo(() => {
    return item?.images || [];
  }, [item]);

  useEffect(() => {
    if (!isOpen) { setCheckedSteps(new Set()); setCurrentImgIdx(0); }
  }, [isOpen]);

  const toggleStep = (index) => {
    const newChecked = new Set(checkedSteps);
    if (newChecked.has(index)) newChecked.delete(index); else newChecked.add(index);
    setCheckedSteps(newChecked);
  };

  const calculateProgress = () => {
    if (!item?.content?.steps?.length) return 0;
    return (checkedSteps.size / item.content.steps.length) * 100;
  };

  const totalSteps = item?.content?.steps?.filter(Boolean).length || 0;
  const isAllStepsChecked = item?.content?.enableChecklist && totalSteps > 0 && checkedSteps.size === totalSteps;

  if (!item) return null;

  return (
    <div className="mb-2 last:mb-0" ref={taskRef}>
      <div className="flex items-center gap-1">
        <button
          onClick={onToggle}
          disabled={isTrainingMode && !isOpen && !isCompleted} // Restrict opening in training mode
          className={`flex-1 text-left p-2 flex items-start gap-2 rounded-lg border-2 border-transparent transition-all duration-200 group
            ${isOpen ? 'bg-white shadow-md z-10' : 'bg-white hover:bg-gray-50'}
            ${isTrainingMode && !isOpen && !isCompleted ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            borderColor: item.color || '#e5e7eb',
            borderLeftWidth: '4px'
          }}
        >
          <div className="mt-0.5 p-1 rounded-md bg-gray-50 text-gray-400 group-hover:text-blue-500 relative">
            {isCompleted ? <CheckCircle size={16} className="text-green-500 fill-green-100" /> : <FileText size={16} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <span className={`font-medium text-sm truncate pr-2 ${isOpen ? 'text-blue-900' : 'text-gray-700'}`}>{item.title}</span>
              {isOpen ? <ChevronDown size={16} className="text-blue-500 flex-shrink-0" /> : <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />}
            </div>
            <span className="text-[10px] text-gray-400 block mt-0.5">Updated: {item.lastUpdated}</span>
          </div>
        </button>

        {isAdmin && !isTrainingMode && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(item); }}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mt-2 -ml-1 mr-1 p-3 bg-white rounded-lg border border-gray-100 shadow-inner animate-fadeIn relative">
          <div className="absolute top-[-10px] left-[17px] w-0.5 h-4" style={{ backgroundColor: item.color || '#bfdbfe' }}></div>

          <p className="text-lg font-bold text-gray-800 mb-4 p-3 rounded-md border-l-2" style={{ backgroundColor: `${item.color}15`, borderColor: item.color || '#bfdbfe' }}>
            {item.content.summary}
          </p>

          {images.length > 0 && (
            <div className="mb-5 relative group/carousel">
              <div
                className="relative w-full aspect-[5/3] bg-gray-100 rounded-lg overflow-hidden cursor-pointer shadow-sm border border-gray-100"
                onClick={() => setShowImageModal(true)}
              >
                <img
                  src={getPlaceholderImage(images[currentImgIdx])}
                  alt={`${item.title} ${currentImgIdx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-black/40 text-white text-[10px] uppercase font-bold px-2 py-1 rounded backdrop-blur-sm pointer-events-none">Zoom</div>
                {images.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); setCurrentImgIdx((prev) => (prev - 1 + images.length) % images.length); }} className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-lg"><ChevronLeft size={20} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setCurrentImgIdx((prev) => (prev + 1) % images.length); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-lg"><ChevronRight size={20} /></button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex justify-center items-center gap-1.5 mt-2">
                  {images.map((_, idx) => (
                    <div key={idx} className={`rounded-full transition-all duration-300 ${idx === currentImgIdx ? 'w-2 h-2' : 'bg-gray-300 w-1.5 h-1.5'}`} style={{ backgroundColor: idx === currentImgIdx ? (item.color || '#3b82f6') : undefined }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {item.content.requirements && item.content.requirements.length > 0 && (
            <div className="mb-6 rounded-lg border overflow-hidden" style={{ borderColor: `${item.color}30`, backgroundColor: `${item.color}05` }}>
              <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: `${item.color}30`, backgroundColor: `${item.color}10` }}>
                <ClipboardList size={16} style={{ color: item.color }} />
                <h4 className="text-xs uppercase tracking-wider font-bold" style={{ color: item.color }}>{item.content.requirementsTitle}</h4>
              </div>
              <div className="divide-y" style={{ divideColor: `${item.color}20` }}>
                {item.content.requirements.filter(req => req.name).map((req, idx) => (
                  <div key={idx} className="flex justify-between items-center px-3 py-2 text-xs md:text-sm">
                    <span className="text-gray-800 font-medium">{req.name}</span>
                    <span className="text-gray-600 font-mono bg-white px-2 py-0.5 rounded border border-gray-100 ml-2">{req.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.content.instructions && (
            <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                <BookOpen size={14} /> Detailed Instructions
              </div>
              <div className="prose prose-sm prose-slate max-w-none font-sans">
                <ReactMarkdown>{item.content.instructions}</ReactMarkdown>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex flex-col gap-2 mb-2">
              <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400">Procedure Steps</h4>
              {item.content.enableChecklist && (
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full transition-all duration-300 ease-out" style={{ width: `${calculateProgress()}%`, backgroundColor: item.color || '#22c55e' }} />
                </div>
              )}
            </div>
            {item.content.enableChecklist ? (
              <div className={`space-y-2 transition-all duration-300 rounded-lg p-3 relative mt-4 border-2 ${isAllStepsChecked ? 'bg-green-50/80 border-green-200' : 'bg-transparent border-transparent'}`}>
                {item.content.steps.filter(Boolean).map((step, idx) => {
                  const isChecked = checkedSteps.has(idx);
                  return (
                    <button key={idx} onClick={() => toggleStep(idx)} className={`w-full text-left p-2.5 rounded border shadow-sm flex items-start gap-2.5 transition-all duration-200 ${isChecked ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                      <div className={`mt-0.5 flex-shrink-0 transition-colors ${isChecked ? 'text-green-600' : 'text-gray-300'}`}>
                        {isChecked ? <CheckCircle size={18} className="fill-green-100" /> : <Circle size={18} />}
                      </div>
                      <span className={`text-sm leading-relaxed ${isChecked ? 'text-gray-500 line-through decoration-gray-300' : 'text-gray-700'}`}>{step}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700">
                {item.content.steps.filter(Boolean).map((step, idx) => (
                  <li key={idx} className="pl-2 leading-relaxed bg-gray-50 p-2.5 rounded border border-gray-100">{step}</li>
                ))}
              </ol>
            )}
          </div>

          {/* TRAINING MODE COMPLETION BUTTON */}
          {isTrainingMode && (
            <div className="mt-8 pt-4 border-t border-gray-100">
              <button
                onClick={onCompleteAndNext}
                disabled={item.content.enableChecklist && !isAllStepsChecked}
                className={`w-full py-4 font-bold rounded-lg shadow-md transform transition-all flex items-center justify-center gap-2
                  ${item.content.enableChecklist && !isAllStepsChecked
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed scale-100'
                    : 'bg-green-600 hover:bg-green-700 text-white hover:scale-[1.01]'
                  }`}
              >
                <CheckCircle size={24} /> Complete & Continue
              </button>
            </div>
          )}
        </div>
      )}
      {showImageModal && <ImageModal src={getPlaceholderImage(images[currentImgIdx], 1200, 720)} alt={item.title} onClose={() => setShowImageModal(false)} />}
    </div>
  );
};

const CategoryItem = ({ category, activeTaskId, onToggleTask, isAdmin, onEdit, isTrainingMode, completedTasks, onCompleteAndNext, isExpanded, onToggleCategory }) => {
  const isAllCompleted = category.items.every(task => completedTasks.has(task.id));

  return (
    <div className="mb-2">
      <button
        onClick={onToggleCategory}
        className={`flex items-center gap-2 w-full p-2.5 rounded-none border-l-4 transition-all duration-200 text-left ${isExpanded ? 'bg-slate-50 border-blue-500 text-slate-800' : 'border-transparent hover:bg-slate-50 text-slate-600'}`}
      >
        <Folder size={18} className={isExpanded ? 'text-slate-600 fill-slate-200' : 'text-slate-400'} />
        <span className="font-bold text-sm uppercase tracking-wide flex-1">{category.title}</span>
        <div className="flex items-center gap-2">
          {/* Status Badge: Completed or New */}
          {isAllCompleted ? (
            <CheckCircle size={16} className="text-green-500 fill-green-100" />
          ) : (
            <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded border border-orange-200">NEW</span>
          )}
          <span className="text-xs font-semibold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{category.items.length}</span>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      </button>
      {isExpanded && (
        <div className="relative mt-1 ml-1 pl-2 border-l border-slate-300 space-y-2">
          {category.items.map(task => (
            <TaskAccordion
              key={task.id}
              item={task}
              isOpen={activeTaskId === task.id}
              onToggle={() => onToggleTask(task.id)}
              isAdmin={isAdmin}
              onEdit={onEdit}
              isTrainingMode={isTrainingMode}
              isCompleted={completedTasks.has(task.id)}
              onCompleteAndNext={() => onCompleteAndNext(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DepartmentItem = ({ dept, isExpanded, onToggle, isAdmin, onEdit, isTrainingMode, completedTasks, activeTaskId, onToggleTask, onCompleteAndNext, activeCatId, onToggleCat }) => {
  const Icon = {
    Briefcase, Utensils, Coffee, Wrench, Heart, Truck, Sun, Droplet, AlertTriangle, Users, ShieldCheck
  }[dept.icon] || ShieldCheck;

  // Check if all sub-categories and their items are complete
  const isAllCompleted = dept.children.every(cat => cat.items.every(item => completedTasks.has(item.id)));

  // Training mode auto-scroll ref for Department
  const deptRef = useRef(null);
  useEffect(() => {
    if (isTrainingMode && isExpanded && deptRef.current) {
      setTimeout(() => {
        scrollToElement(deptRef);
      }, 100);
    }
  }, [isExpanded, isTrainingMode]);


  return (
    <div className="mb-4" ref={deptRef}>
      <button
        onClick={onToggle}
        className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-300 border ${isExpanded ? 'bg-blue-900 text-white shadow-lg border-blue-900 ring-2 ring-blue-100 ring-offset-2' : 'bg-white text-gray-800 shadow-sm border-gray-100 hover:bg-gray-50 hover:border-gray-200'}`}
      >
        <div className={`p-1.5 rounded-lg ${isExpanded ? 'bg-white/10' : 'bg-blue-50'}`}><Icon size={20} className={isExpanded ? 'text-blue-200' : 'text-blue-600'} /></div>
        <span className="text-lg font-bold tracking-tight">{dept.title}</span>
        <div className="ml-auto flex items-center gap-3 opacity-90">
          {isAllCompleted ? (
            <div className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle size={12} /> Done</div>
          ) : (
            <div className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1"><AlertCircle size={12} /> NEW</div>
          )}
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </button>

      {isExpanded && (
        <div className="animate-slideDown pt-2 pb-1">
          {dept.children.map(category => (
            <CategoryItem
              key={category.id}
              category={category}
              activeTaskId={activeTaskId}
              onToggleTask={(taskId) => onToggleTask(taskId)}
              isAdmin={isAdmin}
              onEdit={onEdit}
              isTrainingMode={isTrainingMode}
              completedTasks={completedTasks}
              onCompleteAndNext={onCompleteAndNext}
              isExpanded={activeCatId === category.id} // Controlled expansion for training mode
              onToggleCategory={() => onToggleCat(category.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- COMPACT HEADER PROGRESS BAR ---
const CompactProgressBar = ({ progress, totalTasks, completedCount }) => (
  <div className="flex-1 flex items-center gap-3 bg-blue-800/50 p-2 rounded-lg border border-blue-700 h-12">
    <div className="p-1.5 bg-green-500/20 rounded-md text-green-300">
      <Award size={18} />
    </div>
    <div className="flex-1 flex flex-col justify-center">
      <div className="flex justify-between text-[10px] uppercase font-bold text-blue-200 mb-1">
        <span>Training Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-1.5 bg-blue-900/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-400 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  </div>
);

const NotificationMenu = ({ uncompletedTasks, onSelect, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
    <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[80vh] border border-gray-100">
      <div className="bg-slate-50 border-b p-4 flex justify-between items-center shrink-0">
        <h3 className="font-bold text-lg text-slate-800">Pending Training ({uncompletedTasks.length})</h3>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors"><X size={20} className="text-slate-500" /></button>
      </div>
      <div className="overflow-y-auto">
        {uncompletedTasks.length > 0 ? (
          uncompletedTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onSelect(task)}
              className="w-full text-left p-4 hover:bg-blue-50 border-b border-gray-50 flex items-start gap-4 transition-colors last:border-0 active:bg-blue-100"
            >
              <div className="mt-1.5 w-3 h-3 rounded-full flex-shrink-0 shadow-sm ring-2 ring-white" style={{ backgroundColor: task.color || '#3b82f6' }} />
              <div>
                <div className="font-bold text-sm text-slate-800 line-clamp-1">{task.title}</div>
                <div className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{task.content.summary}</div>
              </div>
            </button>
          ))
        ) : (
          <div className="p-10 text-center text-slate-400 text-sm flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <p className="font-medium text-slate-600">All training modules complete!</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const TrainingPortal = ({ user = { role: 'manager', isAdmin: true }, onBack }) => {
  const [data, setData] = useState([]);
  const [activeDeptId, setActiveDeptId] = useState(null);
  // Add active Category State for stricter control in Training Mode
  const [activeCatId, setActiveCatId] = useState(null);
  // Add active Task State for stricter control
  const [activeTaskId, setActiveTaskId] = useState(null);

  const [weeklyFocus, setWeeklyFocus] = useState(INITIAL_WEEKLY_FOCUS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Training Mode State
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [dismissedTaskIds, setDismissedTaskIds] = useState(new Set());
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);

  // Notifications
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState(null);
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);

  const isAdmin = user?.isAdmin || user?.role === 'manager' || user?.role === 'admin';

  useEffect(() => {
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      const cached = localStorage.getItem('training_data_maracuya_v2');
      const cachedFocus = localStorage.getItem('weekly_focus_maracuya_v2');
      const cachedCompleted = localStorage.getItem('completed_tasks_maracuya');

      if (cached) setData(JSON.parse(cached));
      else setData(INITIAL_DATA);

      if (cachedFocus) setWeeklyFocus(JSON.parse(cachedFocus));
      if (cachedCompleted) setCompletedTasks(new Set(JSON.parse(cachedCompleted)));

      if (!cached) localStorage.setItem('training_data_maracuya_v2', JSON.stringify(INITIAL_DATA));
      setIsLoading(false);
    };
    loadData();
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
    return () => { window.removeEventListener('online', () => setIsOnline(true)); window.removeEventListener('offline', () => setIsOnline(false)); };
  }, []);

  // Calculate Progress & Notifications
  const flatTasks = useMemo(() => flattenTasks(data), [data]);
  const uncompletedTasks = useMemo(() => flatTasks.filter(t => !completedTasks.has(t.id) && !dismissedTaskIds.has(t.id)), [flatTasks, completedTasks, dismissedTaskIds]);
  const progress = flatTasks.length > 0 ? (completedTasks.size / flatTasks.length) * 100 : 0;

  // Toggle Training Mode Logic
  const toggleTrainingMode = () => {
    const newMode = !isTrainingMode;
    setIsTrainingMode(newMode);

    // If turning on, reset view to first uncompleted task or clean state
    if (newMode) {
      // Find first uncompleted task that hasn't been dismissed or completed
      const firstUncompleted = flatTasks.find(t => !completedTasks.has(t.id));
      if (firstUncompleted) {
        setActiveDeptId(firstUncompleted.deptId);
        setActiveCatId(firstUncompleted.catId);
        setActiveTaskId(firstUncompleted.id);
      } else {
        // All done or empty, collapse all
        setActiveDeptId(null);
        setActiveCatId(null);
        setActiveTaskId(null);
      }
    } else {
      // Relaxed state when turning off
      setActiveTaskId(null);
    }
  };

  const handleNotificationClick = (task) => {
    // Add to dismissed set to remove from menu immediately
    setDismissedTaskIds(prev => {
      const next = new Set(prev);
      next.add(task.id);
      return next;
    });

    setIsNotificationOpen(false);
    setIsTrainingMode(true);
    setActiveDeptId(task.deptId);
    setActiveCatId(task.catId);
    setActiveTaskId(task.id);
  };

  const handleCompleteAndNext = (currentId) => {
    // 1. Mark current as complete
    const newCompleted = new Set(completedTasks);
    newCompleted.add(currentId);
    setCompletedTasks(newCompleted);
    localStorage.setItem('completed_tasks_maracuya', JSON.stringify([...newCompleted]));

    // 2. Find next task
    const currentIndex = flatTasks.findIndex(t => t.id === currentId);
    if (currentIndex > -1 && currentIndex < flatTasks.length - 1) {
      const nextTask = flatTasks[currentIndex + 1];

      // 3. Smooth transition logic

      // If Department changes:
      if (nextTask.deptId !== activeDeptId) {
        setActiveDeptId(null); // Briefly close to trigger animation
        setTimeout(() => {
          setActiveDeptId(nextTask.deptId);
          setActiveCatId(nextTask.catId);
          setActiveTaskId(nextTask.id);
        }, 400); // Wait for close animation
      }
      // If Category changes but Dept is same:
      else if (nextTask.catId !== activeCatId) {
        setActiveCatId(null); // Close current category
        setTimeout(() => {
          setActiveCatId(nextTask.catId);
          setActiveTaskId(nextTask.id);
        }, 300);
      }
      // Just Task changes
      else {
        setActiveTaskId(nextTask.id);
      }

    } else {
      // Module Complete! Show Modal
      setIsCompletionModalOpen(true);
      setActiveTaskId(null);
    }
  };

  const handleSaveEntry = (formData) => {
    const newData = [...data];
    let deptIndex = -1;
    if (formData.deptId === 'new') {
      const newDept = { id: `dept_${Date.now()}`, title: formData.newDeptTitle || 'New Dept', icon: 'Briefcase', type: 'department', children: [] };
      newData.push(newDept);
      deptIndex = newData.length - 1;
      formData.deptId = newDept.id;
    } else {
      deptIndex = newData.findIndex(d => d.id === formData.deptId);
    }
    if (deptIndex === -1) return;
    let dept = { ...newData[deptIndex] };
    let catId = formData.catId;
    if (catId === 'new') {
      const newCat = { id: `cat_${Date.now()}`, title: formData.newCatTitle || 'New Cat', type: 'category', items: [] };
      dept.children = [...dept.children, newCat];
      catId = newCat.id;
    }
    const catIndex = dept.children.findIndex(c => c.id === catId);
    if (catIndex > -1) {
      const cat = { ...dept.children[catIndex] };
      const newEntry = {
        id: formData.id || `task_${Date.now()}`,
        title: formData.title,
        lastUpdated: new Date().toISOString().split('T')[0],
        images: formData.images,
        color: formData.color,
        content: {
          summary: formData.summary,
          instructions: formData.instructions,
          enableChecklist: formData.enableChecklist,
          requirementsTitle: formData.requirementsTitle,
          requirements: formData.requirements.filter(r => r.name),
          steps: formData.steps.filter(Boolean)
        }
      };
      if (formData.id) {
        const itemIdx = cat.items.findIndex(i => i.id === formData.id);
        if (itemIdx > -1) cat.items[itemIdx] = newEntry;
      } else {
        cat.items = [newEntry, ...cat.items];
      }
      dept.children[catIndex] = cat;
      newData[deptIndex] = dept;
      setData(newData);
      localStorage.setItem('training_data_maracuya_v2', JSON.stringify(newData));
    }
  };

  const handleDeleteEntry = (entryId) => {
    const newData = data.map(dept => ({ ...dept, children: dept.children.map(cat => ({ ...cat, items: cat.items.filter(item => item.id !== entryId) })) }));
    setData(newData);
    localStorage.setItem('training_data_maracuya_v2', JSON.stringify(newData));
  };

  const handleMoveUpEntry = (entryId) => {
    let newData = [...data];
    let itemFound = false;
    for (let d = 0; d < newData.length; d++) {
      if (itemFound) break;
      for (let c = 0; c < newData[d].children.length; c++) {
        const items = newData[d].children[c].items;
        const index = items.findIndex(item => item.id === entryId);
        if (index > 0) {
          const itemToMove = items[index];
          items.splice(index, 1);
          items.splice(index - 1, 0, itemToMove);
          itemFound = true;
          break;
        }
      }
    }
    if (itemFound) {
      setData(newData);
      localStorage.setItem('training_data_maracuya_v2', JSON.stringify(newData));
    }
  };

  const handleSaveFocus = (newFocus) => {
    setWeeklyFocus(newFocus);
    localStorage.setItem('weekly_focus_maracuya_v2', JSON.stringify(newFocus));
  };

  const openAddModal = () => { setEntryToEdit(null); setIsEntryModalOpen(true); };
  const openEditModal = (entry) => { setEntryToEdit(entry); setIsEntryModalOpen(true); };

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const lowerQuery = searchQuery.toLowerCase();
    return data.map(dept => {
      const matchingChildren = dept.children.map(cat => {
        const matchingItems = cat.items.filter(item =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.content.summary.toLowerCase().includes(lowerQuery)
        );
        if (matchingItems.length > 0) return { ...cat, items: matchingItems };
        if (cat.title.toLowerCase().includes(lowerQuery)) return cat;
        return null;
      }).filter(Boolean);
      if (matchingChildren.length > 0 || dept.title.toLowerCase().includes(lowerQuery)) return { ...dept, children: matchingChildren };
      return null;
    }).filter(Boolean);
  }, [data, searchQuery]);

  if (isLoading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <header className="bg-blue-900 text-white sticky top-0 z-40 shadow-lg transition-all duration-300">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1.5 mr-2 bg-blue-800 hover:bg-blue-700 rounded-full text-blue-200 hover:text-white transition-colors flex-shrink-0"
                title="Back"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            {/* LOGO */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="p-1.5 bg-blue-800 rounded-lg"><BookOpen size={20} className="text-blue-200" /></div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold leading-none">MARACUYA</h1>
                <p className="text-[10px] text-blue-300">Staff Portal</p>
              </div>
            </div>

            {/* MIDDLE: SEARCH OR PROGRESS */}
            {isTrainingMode ? (
              <CompactProgressBar
                progress={progress}
                totalTasks={flatTasks.length}
                completedCount={completedTasks.size}
              />
            ) : (
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-blue-800/50 border border-blue-700 text-white text-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-blue-800 transition-all h-12"
                />
                <Search className="absolute left-3 top-3.5 text-blue-300" size={16} />
                {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3.5 text-blue-300 hover:text-white"><X size={16} /></button>}
              </div>
            )}

            {/* RIGHT CONTROLS */}
            <div className="flex items-center gap-3 flex-shrink-0 ml-1">

              {/* NOTIFICATION BELL */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2 rounded-full hover:bg-blue-800 transition-colors"
                >
                  <Bell size={20} className="text-blue-200" />
                  {uncompletedTasks.length > 0 && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-blue-900 shadow-sm">
                      {uncompletedTasks.length > 9 ? '9+' : uncompletedTasks.length}
                    </div>
                  )}
                </button>
                {isNotificationOpen && (
                  <NotificationMenu
                    uncompletedTasks={uncompletedTasks}
                    onSelect={handleNotificationClick}
                    onClose={() => setIsNotificationOpen(false)}
                  />
                )}
              </div>

              {/* ROCKER SWITCH */}
              <div className="flex items-center gap-2 bg-blue-800/50 p-1.5 rounded-full border border-blue-700 h-10">
                <span className={`text-[10px] font-bold uppercase px-1 ${!isTrainingMode ? 'text-white' : 'text-blue-300'}`}>Work</span>
                <button
                  onClick={toggleTrainingMode}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-300 focus:outline-none ${isTrainingMode ? 'bg-green-500' : 'bg-gray-400'}`}
                >
                  <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full shadow-sm transition-transform duration-300 ${isTrainingMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <span className={`text-[10px] font-bold uppercase px-1 ${isTrainingMode ? 'text-green-300' : 'text-blue-300'}`}>Train</span>
              </div>

              {/* ADD SOP BUTTON (REPLACES WIFI) */}
              {isAdmin && !isTrainingMode && (
                <button
                  onClick={openAddModal}
                  className="bg-blue-500 hover:bg-blue-400 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-colors"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {!searchQuery && !isTrainingMode && (
          <div className="mb-6 p-4 rounded-lg shadow-sm border-l-4 relative group" style={{ backgroundColor: `${weeklyFocus.color}15`, borderColor: weeklyFocus.color }}>
            <h2 className="text-sm font-bold text-gray-800 mb-1">{weeklyFocus.title}</h2>
            <p className="text-sm text-gray-600">{weeklyFocus.text}</p>
            {isAdmin && (
              <button onClick={() => setIsFocusModalOpen(true)} className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 size={16} />
              </button>
            )}
          </div>
        )}

        <div className="space-y-4">
          {filteredData.length > 0 ? (
            filteredData.map(dept => (
              <DepartmentItem
                key={dept.id}
                dept={dept}
                isExpanded={isTrainingMode ? (activeDeptId === dept.id) : (activeDeptId === dept.id)}
                onToggle={() => {
                  if (!isTrainingMode) {
                    setActiveDeptId(prev => prev === dept.id ? null : dept.id);
                  } else {
                    setActiveDeptId(prev => prev === dept.id ? null : dept.id);
                  }
                }}
                isAdmin={isAdmin}
                onEdit={openEditModal}
                isTrainingMode={isTrainingMode}
                completedTasks={completedTasks}
                activeTaskId={activeTaskId}
                onToggleTask={(id) => {
                  if (isTrainingMode) {
                    setActiveTaskId(prev => prev === id ? null : id);
                  } else {
                    setActiveTaskId(prev => prev === id ? null : id);
                  }
                }}
                onCompleteAndNext={handleCompleteAndNext}
                activeCatId={activeCatId}
                onToggleCat={(id) => {
                  setActiveCatId(prev => prev === id ? null : id);
                }}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-gray-200 rounded-full mb-4"><Search size={32} className="text-gray-400" /></div>
              <h3 className="text-lg font-medium text-gray-600">No procedures found</h3>
            </div>
          )}
        </div>
      </main>

      <EntryModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        departments={data}
        onSave={handleSaveEntry}
        onDelete={handleDeleteEntry}
        onMoveUp={handleMoveUpEntry}
        initialData={entryToEdit}
      />

      <WeeklyFocusModal
        isOpen={isFocusModalOpen}
        onClose={() => setIsFocusModalOpen(false)}
        data={weeklyFocus}
        onSave={handleSaveFocus}
      />

      <CompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
      />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; height: 0; } to { opacity: 1; height: auto; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.3s ease-out forwards; }
        .animate-slideDown { animation: slideDown 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default TrainingPortal;