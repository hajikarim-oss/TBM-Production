import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { assetUrl } from '@/lib/utils';

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
    portrait: '/saurabh.jpeg',
    bio: 'A director who shoots for feeling first. Known for high-speed macro food and spice cinematography, big-brand commercials, and large-scale celebrity ad films.',
    brands: [
      'Zoff Spices',
      'Blue Stone Jewellery',
      'Vibhor Oil',
      'House of Abhinandan Lodha',
      'Orra Jewellery',
      'Nova AI+',
      'Jordan Toothpaste',
      'Yousta',
    ],
  },
  {
    name: 'Suraj Adawade',
    role: 'Executive Producer',
    experience: '7+ Years Studio Production',
    portrait: '/suraj.jpeg',
    bio: 'Runs the engine room of every shoot. Commands high-tempo production, multi-location logistics, and a fast post pipeline across Mumbai, Goa, and pan-India.',
    brands: [
      'Blue Tyga',
      'Atomberg Technologies',
      'Adidas',
      'Shopaarel Cosmetics',
      'Straex',
      'Bombay Sweet Shop',
      'Happi Planet',
    ],
  },
];

function ProducerCard({ member, index }: { member: CrewMember; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 220, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 220, damping: 25 });
  const rotateX = useTransform(springY, [-120, 120], [5, -5]);
  const rotateY = useTransform(springX, [-120, 120], [-5, 5]);

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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.14, ease: [0.23, 1, 0.32, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="tbm-producerDossier__top">
        <div className="tbm-producerDossier__imgWrap">
          <img
            src={assetUrl(member.portrait)}
            alt={member.name}
            className="tbm-producerDossier__img"
            decoding="async"
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
              <span>COMMERCIAL FILMOGRAPHY</span>
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
          <h2 className="tbm-producers__title">
            The Producers<br />
            <span className="tbm-text-highlight">Who Make It Happen.</span>
          </h2>
          <p className="tbm-producers__desc">
            Every shoot needs someone who can't afford to fail. These are the two for us!!.
          </p>
        </div>

        <div className="tbm-producers__grid">
          {CREW.map((member, idx) => (
            <ProducerCard key={member.name} member={member} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
