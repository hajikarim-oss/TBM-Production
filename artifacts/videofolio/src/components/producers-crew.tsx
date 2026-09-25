import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export interface CrewMember {
  name: string;
  role: string;
  experience: string;
  portrait: string;
  bio: string;
  brands: string[];
}

const CREW: CrewMember[] = [
  {
    name: 'Saurabh Chaubey',
    role: 'Producer & Director',
    experience: '8+ Years Industry Directing',
    portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=75',
    bio: 'Directing cinematic visual narratives with deep emotional pacing. Renowned for high-speed macro food and spice cinematography, commercial TVCs, and large-scale celebrity ad films.',
    brands: [
      'Zoff Spices',
      'Blue Stone Jewellery',
      'Vibhor Oil',
      'House of Abhinandan Lodha',
      'Orra Jewellery',
      'Nova AI+',
      'Jordan Toothpaste',
      'Yousta (Reliance Retail)',
    ],
  },
  {
    name: 'Suraj Adawade',
    role: 'Executive Producer',
    experience: '7+ Years Studio Production',
    portrait: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=75',
    bio: 'Commanding high-tempo physical production, complex multi-location commercial logistics, and rapid post-production pipeline execution across Mumbai, Goa, and pan-India shoots.',
    brands: [
      'Blue Tyga (Milind Soman)',
      'Atomberg Technologies',
      'Adidas India',
      'Shopaarel Cosmetics',
      'Straex Footwear',
      'Bombay Sweet Shop',
      'Setu Nutrition (Ankita Raina)',
    ],
  },
];

function ProducerCard({ member }: { member: CrewMember }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(springY, [-150, 150], [8, -8]);
  const rotateY = useTransform(springX, [-150, 150], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="tbm-producerDossier"
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="tbm-producerDossier__top">
        <div className="tbm-producerDossier__imgWrap">
          <img
            src={member.portrait}
            alt={member.name}
            className="tbm-producerDossier__img"
            loading="lazy"
          />
          <div className="tbm-producerDossier__scrim" />
          
          <div className="tbm-producerDossier__rolePill">
            <span className="tbm-roleDot" />
            <span>{member.role}</span>
          </div>
        </div>

        <div className="tbm-producerDossier__body">
          <div className="tbm-producerDossier__titleRow">
            <h3 className="tbm-producerDossier__name">{member.name}</h3>
            <span className="tbm-producerDossier__exp">{member.experience}</span>
          </div>

          <p className="tbm-producerDossier__bio">{member.bio}</p>

          <div className="tbm-producerDossier__credits">
            <div className="tbm-creditsHeader">
              <span>COMMERCIAL FILMOGRAPHY ({member.brands.length} CLIENTS)</span>
            </div>
            <div className="tbm-creditsList">
              {member.brands.map((b) => (
                <span key={b} className="tbm-creditBadge">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProducersCrew() {
  return (
    <section className="tbm-producers" id="team">
      <div className="tbm-container">
        <div className="tbm-producers__header">
          <div className="tbm-sectionEyebrow">
            <span className="tbm-eyebrowLine" />
            <span>004 — LEADERSHIP & PRODUCTION</span>
          </div>



          <h2 className="tbm-producers__title">
            The Producers & Directors.<br />
            Behind Every Delivery.
          </h2>
          <p className="tbm-producers__desc">
            Directing sets and leading full-pipeline execution from Mumbai to pan-India locations.
          </p>
        </div>

        <div className="tbm-producers__grid">
          {CREW.map((member) => (
            <ProducerCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
