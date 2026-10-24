import React, { useState } from 'react';
import { Heart, Activity, Brain, Shield, Info, ArrowRight, Stethoscope, AlertTriangle } from 'lucide-react';

interface AnatomicalSystem {
  id: string;
  name: string;
  category: string;
  icon: typeof Heart;
  emergencyAction: string;
  clinicalLandmarks: string;
  firstAidProtocol: string[];
  citation: string;
}

const SYSTEMS: AnatomicalSystem[] = [
  {
    id: 'cardio',
    name: 'Cardiovascular & Thoracic',
    category: 'Circulatory Emergency',
    icon: Heart,
    emergencyAction: 'CPR & AED Landmark Guidance',
    clinicalLandmarks: 'Lower half of the sternum in the center of the chest. High right clavicle and lower left axillary line for AED pads.',
    firstAidProtocol: [
      'Compress at 100–120 beats/minute to a depth of 5–6 cm (2–2.4 in).',
      'Allow complete chest recoil between compressions.',
      'Apply AED pads immediately upon arrival without pausing compressions.'
    ],
    citation: 'AHA / ERC 2025 BLS Guidelines'
  },
  {
    id: 'respiratory',
    name: 'Airway & Pulmonary',
    category: 'Respiratory Distress & Choking',
    icon: Activity,
    emergencyAction: 'Airway Clearance & Heimlich Thrust',
    clinicalLandmarks: 'Midline abdomen, just above the navel and well below the xiphoid process.',
    firstAidProtocol: [
      'Stand behind the person, wrap arms around waist.',
      'Make a fist with one hand and place the thumb side against the abdomen.',
      'Deliver quick, upward inward thrusts until the foreign body is expelled.'
    ],
    citation: 'WHO Emergency Triage & Choking Protocol'
  },
  {
    id: 'cerebral',
    name: 'Cerebrovascular & Cranial',
    category: 'Acute Stroke & Neuro Deficit',
    icon: Brain,
    emergencyAction: 'FAST Stroke Recognition & Positioning',
    clinicalLandmarks: 'Facial nerve symmetry, motor cortex bilateral arm extension, Broca speech processing.',
    firstAidProtocol: [
      'Face: Ask patient to smile — look for unilateral droop.',
      'Arms: Ask patient to raise both arms — check for drifting.',
      'Speech: Ask patient to repeat a simple sentence — note slurring.',
      'Time: Immediate call to 112. Do NOT administer aspirin or food.'
    ],
    citation: 'World Stroke Organization Clinical Pathway'
  },
  {
    id: 'trauma',
    name: 'Musculoskeletal & Vascular',
    category: 'Severe Hemorrhage & Trauma',
    icon: Shield,
    emergencyAction: 'Direct Pressure & Tourniquet Site',
    clinicalLandmarks: '5–7 cm (2–3 in) proximal to limb bleeding wound, never over a joint.',
    firstAidProtocol: [
      'Apply firm, continuous direct pressure using sterile dressing.',
      'If arterial spurting persists on limb, apply commercial windlass tourniquet.',
      'Tighten until bleeding halts completely; record exact application time.'
    ],
    citation: 'Stop the Bleed® / AIIMS Trauma Protocol'
  }
];

export const EducationalAnatomyPanel: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState<AnatomicalSystem>(SYSTEMS[0]);

  return (
    <div className="rounded-3xl bg-[#FAF8F5] border border-[#C4A66B]/30 p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#C4A66B]/20">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#173E35] border border-[#C4A66B]/40 flex items-center justify-center text-[#C4A66B]">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#173E35] uppercase font-mono tracking-wider">
              Educational Anatomy
            </h3>
            <p className="text-[10px] text-[#173E35]/70">
              Interactive first-aid physiological landmarks & resuscitation vectors
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#173E35] text-[#F1F0E9] border border-[#C4A66B]/30 font-bold">
          Reference Only
        </span>
      </div>

      {/* Systems Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SYSTEMS.map(sys => {
          const Icon = sys.icon;
          const isSelected = selectedSystem.id === sys.id;
          return (
            <button
              key={sys.id}
              onClick={() => setSelectedSystem(sys)}
              className={`p-2.5 rounded-2xl text-left transition-all border flex items-center space-x-2 ${
                isSelected
                  ? 'bg-[#173E35] text-[#F1F0E9] border-[#C4A66B] shadow-md ring-1 ring-[#C4A66B]/40'
                  : 'bg-white text-[#173E35] border-[#C4A66B]/25 hover:border-[#173E35]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#C4A66B]' : 'text-[#173E35]'}`} />
              <div className="min-w-0">
                <p className="text-xs font-bold truncate leading-tight">{sys.name.split(' ')[0]}</p>
                <p className="text-[9px] font-mono opacity-75 truncate">{sys.category.split(' ')[0]}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Showcase Container */}
      <div className="p-4 rounded-2xl bg-white border border-[#C4A66B]/25 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#C4A66B]/15">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-[#7A5E2E]">
              {selectedSystem.category}
            </span>
            <h4 className="text-sm font-bold text-[#173E35] mt-0.5">
              {selectedSystem.emergencyAction}
            </h4>
          </div>
          <div className="p-1.5 rounded-xl bg-[#F1F0E9] text-[#173E35] border border-[#C4A66B]/30">
            <selectedSystem.icon className="w-5 h-5 text-[#CC3B2D]" />
          </div>
        </div>

        {/* Anatomical Landmark */}
        <div className="p-3 rounded-xl bg-[#F1F0E9]/80 border border-[#C4A66B]/20 space-y-1">
          <p className="text-[10px] font-mono font-bold text-[#173E35] uppercase tracking-wider">
            Anatomical Target Landmark:
          </p>
          <p className="text-xs text-[#173E35]/85 leading-relaxed font-sans">
            {selectedSystem.clinicalLandmarks}
          </p>
        </div>

        {/* First Aid Steps */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-mono font-bold text-[#7A5E2E] uppercase tracking-wider">
            Standard Resuscitation Protocol:
          </p>
          <ul className="space-y-1 text-xs text-[#173E35]/80 font-sans">
            {selectedSystem.firstAidProtocol.map((step, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#173E35] text-[#F1F0E9] text-[9px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Source Citation & Truthful Disclaimer */}
        <div className="pt-2 border-t border-[#C4A66B]/20 flex items-center justify-between text-[10px] text-[#173E35]/85 font-mono font-medium">
          <span>Source: {selectedSystem.citation}</span>
          <span>Zero False Biometrics</span>
        </div>
      </div>
    </div>
  );
};
