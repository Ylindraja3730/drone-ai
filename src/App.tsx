import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radar, 
  ShieldAlert, 
  Target, 
  Radio, 
  Activity, 
  AlertTriangle, 
  ShieldCheck,
  Settings,
  Cpu,
  Eye,
  Lock,
  Wifi,
  ChevronRight,
  Database
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Types ---
type ThreatLevel = 'SAFE' | 'SUSPICIOUS' | 'THREAT';

interface DroneSignature {
    model: string;
    brand: string;
    rfRange: string;
    protocol: string;
    visualMarkers: string[];
    defaultThreat: ThreatLevel;
}

interface DroneDetected {
  id: string;
  type: string;
  brand: string;
  distance: number; 
  altitude: number; 
  significance: number; 
  rfSignature: string;
  frequency: string;
  confidence: number;
  visualMarkers: string[];
  threatLevel: ThreatLevel;
  timestamp: string;
  status: 'TRACKING' | 'LOST' | 'NEUTRALIZED';
  coords: { x: number; y: number };
}

const DRONE_LIBRARY: DroneSignature[] = [
    {
        model: "Mavic 3 Pro",
        brand: "DJI",
        rfRange: "2.4GHz / 5.8GHz",
        protocol: "OcuSync 3.0",
        visualMarkers: ["Foldable Arms", "Triple Camera Array", "Gray Chassis"],
        defaultThreat: 'SUSPICIOUS'
    },
    {
        model: "Avata",
        brand: "DJI",
        rfRange: "5.8GHz",
        protocol: "DJI HDL",
        visualMarkers: ["CineWhoop Frame", "Integrated Prop Guards"],
        defaultThreat: 'SUSPICIOUS'
    },
    {
        model: "FPV Racing Custom",
        brand: "DIY/Custom",
        rfRange: "5.8GHz / 915MHz",
        protocol: "ELRS / Crossfire",
        visualMarkers: ["Carbon Fiber Frame", "Exposed Electronics", "High-Alpha Angle"],
        defaultThreat: 'THREAT'
    },
    {
        model: "Orlan-10 (Simulated)",
        brand: "State-Actor",
        rfRange: "400MHz - 900MHz",
        protocol: "Military Grade Encrypted",
        visualMarkers: ["Fixed Wing", "Rear-Propeller", "Pusher Config"],
        defaultThreat: 'THREAT'
    }
];

// --- Mock Data Generator ---
const generateMockSignal = () => {
    return Array.from({ length: 20 }, (_, i) => ({
        time: i,
        v: Math.random() * 100 + (Math.sin(i / 2) * 20),
        v2: Math.random() * 50 + (Math.cos(i / 1.5) * 30),
    }));
};

export default function App() {
  const [drones, setDrones] = useState<DroneDetected[]>([]);
  const [activeDrone, setActiveDrone] = useState<DroneDetected | null>(null);
  const [radarRotation, setRadarRotation] = useState(0);
  const [signals, setSignals] = useState(generateMockSignal());
  const [logs, setLogs] = useState<string[]>(["SYSTEM BOOTED", "RADAR INITIALIZED", "RF SENSORS ONLINE"]);
  const [isAlert, setIsAlert] = useState(false);

  // Radar Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarRotation(prev => (prev + 2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Update Signals
  useEffect(() => {
    const interval = setInterval(() => {
      setSignals(prev => {
          const next = [...prev.slice(1), { 
              time: Date.now(), 
              v: Math.random() * 100 + (Math.sin(Date.now() / 1000) * 20),
              v2: Math.random() * 50 + (Math.cos(Date.now() / 1500) * 30),
          }];
          return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate Detections
  useEffect(() => {
    const addDrone = () => {
        const id = `UAV-${Math.floor(Math.random() * 9000) + 1000}`;
        const signature = DRONE_LIBRARY[Math.floor(Math.random() * DRONE_LIBRARY.length)];
        
        const newDrone: DroneDetected = {
            id,
            type: signature.model,
            brand: signature.brand,
            distance: Math.floor(Math.random() * 1000) + 200,
            altitude: Math.floor(Math.random() * 150) + 10,
            significance: Math.random(),
            rfSignature: signature.protocol,
            frequency: signature.rfRange,
            confidence: 0.85 + (Math.random() * 0.14),
            visualMarkers: signature.visualMarkers,
            threatLevel: signature.defaultThreat,
            timestamp: new Date().toLocaleTimeString(),
            status: 'TRACKING',
            coords: { x: (Math.random() - 0.5) * 80, y: (Math.random() - 0.5) * 80 }
        };

        setDrones(prev => [newDrone, ...prev].slice(0, 5));
        setLogs(prev => [`ANALYSIS: ${newDrone.id} classified as ${newDrone.brand} ${newDrone.type}`, ...prev]);
        
        if (newDrone.threatLevel === 'THREAT') {
            setIsAlert(true);
            setActiveDrone(newDrone);
            setTimeout(() => setIsAlert(false), 5000);
        }
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) addDrone();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden selection:bg-defense-green/30">
      <div className="scanline" />
      
      {/* --- Top Header --- */}
      <header className="h-16 border-b border-defense-green/20 bg-defense-bg/80 backdrop-blur-md flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-defense-green/10 rounded border border-defense-green/30">
            <Lock className="w-5 h-5 text-defense-green" />
          </div>
          <div>
            <h1 className="font-mono text-lg font-bold tracking-tighter text-white uppercase italic">
              EagleEye <span className="text-defense-green">v4.0</span>
            </h1>
            <p className="text-[10px] font-mono text-defense-green/60 uppercase tracking-widest">Hybrid Defense Systems • Restricted Access</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-defense-green uppercase tracking-widest mb-1">System Integrity</span>
            <div className="h-1 w-32 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                className="h-full bg-defense-green" 
              />
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-defense-red/10 border border-defense-red/30 rounded text-defense-red animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-mono font-bold tracking-widest">DEFCON 3</span>
          </div>
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        
        {/* --- Left Column: Radar & Visual --- */}
        <section className="w-1/3 flex flex-col gap-4">
          {/* Radar Module */}
          <div className="flex-1 bg-black/40 border border-defense-green/20 rounded-xl relative overflow-hidden flex items-center justify-center">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 px-3 py-1 rounded border border-defense-green/10">
                <Radar className="w-4 h-4 text-defense-green animate-spin" />
                <span className="text-xs font-mono text-defense-green uppercase tracking-widest">Local Scanner active</span>
            </div>
            
            {/* Visual Radar */}
            <div className="relative w-full aspect-square max-w-[400px] flex items-center justify-center">
                {/* Rings */}
                {[...Array(4)].map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute radar-ring" 
                        style={{ width: `${(i + 1) * 25}%`, height: `${(i + 1) * 25}%` }} 
                    />
                ))}
                
                {/* Sweeper */}
                <motion.div 
                    className="absolute w-1/2 h-px bg-gradient-to-r from-transparent to-defense-green origin-left z-0"
                    style={{ rotate: radarRotation, top: '50%', left: '50%' }}
                />
                
                {/* Blips */}
                {drones.map(drone => (
                    <motion.div
                        key={drone.id}
                        initial={{ opacity: 0, scale: 2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`absolute w-3 h-3 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 z-10 ${
                            drone.threatLevel === 'THREAT' ? 'bg-defense-red shadow-[0_0_10px_#ff0000]' : 'bg-orange-500 shadow-[0_0_10px_#f97316]'
                        }`}
                        style={{ 
                            left: `${50 + drone.coords.x}%`, 
                            top: `${50 + drone.coords.y}%` 
                        }}
                    >
                        <div className="absolute inset-0 rounded-full animate-ping bg-inherit opacity-75" />
                        <span className="absolute top-4 left-4 whitespace-nowrap text-[8px] font-mono text-white/80 uppercase bg-black/40 px-1">
                            {drone.id}
                        </span>
                    </motion.div>
                ))}
                
                {/* Center Point */}
                <div className="w-2 h-2 bg-defense-blue rounded-full shadow-[0_0_10px_#00d4ff]" />
            </div>
          </div>

          {/* AI Activity Logs */}
          <div className="h-1/3 bg-black/40 border border-defense-green/20 rounded-xl p-4 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-3 border-b border-defense-green/10 pb-2">
              <Database className="w-4 h-4 text-defense-green" />
              <h2 className="text-xs font-mono text-white uppercase font-bold tracking-widest">Operation Logs</h2>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 pr-2">
              <AnimatePresence initial={false}>
                {logs.map((log, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-mono border-l-2 border-defense-green/20 pl-2 py-0.5 text-defense-green/80 hover:text-defense-green transition-colors"
                  >
                    <span className="text-defense-green opacity-40">[{new Date().toLocaleTimeString()}]</span> {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* --- Middle Column: Live Analysis --- */}
        <section className="flex-1 flex flex-col gap-4">
          {/* Main Visualizer */}
          <div className="flex-1 bg-black border border-defense-green/20 rounded-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544372549-9c595f9d146c?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center grayscale brightness-50 opacity-40 mix-blend-overlay"></div>
            
            {/* Viewfinder Overlays */}
            <div className="absolute inset-8 border border-white/10 pointer-events-none">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-defense-green" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-defense-green" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-defense-green" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-defense-green" />
            </div>

            {/* Target Reticle */}
            {activeDrone && (
                <motion.div 
                    className="absolute z-10 pointer-events-none"
                    initial={{ scale: 3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, left: '45%', top: '30%' }}
                >
                    <div className="relative flex items-center justify-center">
                        <Target className="w-32 h-32 text-defense-red animate-pulse" />
                        <div className="absolute -top-16 -right-16 w-64 p-3 bg-black/95 border border-defense-red backdrop-blur shadow-2xl">
                            <h3 className="text-xs font-mono text-defense-red font-bold uppercase mb-1 flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3" /> Target Lock: {activeDrone.brand}
                            </h3>
                            <div className="grid grid-cols-2 gap-2 border-t border-defense-red/20 pt-2 text-[10px] font-mono">
                                <div className="col-span-2 bg-defense-red/10 p-1.5 border border-defense-red/20 mb-1">
                                    <p className="text-[8px] text-white/40 uppercase">Classification</p>
                                    <p className="text-white font-bold tracking-widest">{activeDrone.type}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] text-white/40 uppercase">RF Spec</p>
                                    <p className="text-white tabular-nums">{activeDrone.frequency}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] text-white/40 uppercase">Protocol</p>
                                    <p className="text-defense-blue">{activeDrone.rfSignature}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[8px] text-white/40 uppercase mb-1">Visual Evidence</p>
                                    <div className="flex flex-wrap gap-1">
                                        {activeDrone.visualMarkers.map((m, i) => (
                                            <span key={i} className="bg-white/10 px-1 py-0.5 rounded text-[8px] text-white/80">{m}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Simulated Classification Data */}
            <div className="absolute bottom-6 left-6 z-10 w-64 bg-black/80 p-4 border border-white/10 rounded backdrop-blur shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-3 h-3 text-white" />
                    <span className="text-[10px] font-mono text-white uppercase font-bold tracking-widest">Vision AI Processing</span>
                </div>
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] text-white/60">CONFIDENCE</span>
                            <span className="text-xs font-mono text-defense-green">98.2%</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: '98%' }} className="h-full bg-defense-green" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-[10px] text-white/60">MODEL</span>
                            <p className="text-[10px] font-mono text-white">YOLO_v8+</p>
                        </div>
                        <div>
                            <span className="text-[10px] text-white/60">LATENCY</span>
                            <p className="text-[10px] font-mono text-defense-green">14ms</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Telemetry Overlay */}
            <div className="absolute top-6 right-6 z-10 text-right space-y-1 bg-black/40 p-2 rounded border border-white/5 backdrop-blur">
                <p className="text-xs font-mono text-white uppercase font-bold tabular-nums">LAT: 34.0522° N</p>
                <p className="text-xs font-mono text-white uppercase font-bold tabular-nums">LNG: 118.2437° W</p>
                <p className="text-xs font-mono text-defense-green uppercase font-bold tabular-nums">ALT: 45.2m AMSL</p>
            </div>
          </div>

          {/* RF Signal Graph */}
          <div className="h-1/3 bg-black/40 border border-defense-green/20 rounded-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-defense-blue" />
                    <h2 className="text-xs font-mono text-white uppercase font-bold tracking-widest">Signal Spectrum</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 group cursor-help">
                        <div className="w-2 h-2 bg-defense-blue rounded-full" />
                        <span className="text-[8px] text-white/40 uppercase tracking-widest">2.4GHz C2</span>
                    </div>
                    <div className="flex items-center gap-1 group cursor-help">
                        <div className="w-2 h-2 bg-pink-500 rounded-full" />
                        <span className="text-[8px] text-white/40 uppercase tracking-widest">5.8GHz FPV</span>
                    </div>
                </div>
            </div>
            <div className="flex-1 w-full -ml-8 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={signals}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis dataKey="time" hide />
                        <YAxis hide domain={[0, 150]} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#000', border: '1px solid #00ff41', fontSize: '10px', fontFamily: 'monospace' }}
                            itemStyle={{ color: '#00d4ff' }}
                        />
                        <Line type="monotone" dataKey="v" stroke="#00d4ff" strokeWidth={2} dot={false} isAnimationActive={false} />
                        <Line type="monotone" dataKey="v2" stroke="#ec4899" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* --- Right Column: Threat Intel --- */}
        <aside className="w-1/4 flex flex-col gap-4">
          {/* Active Threats List */}
          <div className="flex-1 bg-black/40 border border-defense-green/20 rounded-xl p-4 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 mb-4 border-b border-defense-green/10 pb-2">
              <ShieldAlert className="w-4 h-4 text-defense-red" />
              <h2 className="text-xs font-mono text-white uppercase font-bold tracking-widest">Threat Matrix</h2>
            </div>
            
            <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {drones.map(drone => (
                  <motion.div 
                    key={drone.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: 20 }}
                    onClick={() => setActiveDrone(drone)}
                    className={`p-3 border-l-4 cursor-pointer transition-all hover:bg-white/5 group relative ${
                        drone.id === activeDrone?.id ? 'bg-white/5' : ''
                    } ${
                        drone.threatLevel === 'THREAT' ? 'border-defense-red bg-defense-red/5' : 'border-orange-500 bg-orange-500/5'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex flex-col">
                        <span className="text-xs font-mono font-bold text-white tracking-widest">{drone.id}</span>
                        <span className="text-[8px] font-mono text-defense-green/60 uppercase">Confidence: {(drone.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        drone.threatLevel === 'THREAT' ? 'bg-defense-red text-white' : 'bg-orange-500 text-white'
                      }`}>
                        {drone.threatLevel}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/40 uppercase mb-2 italic">
                        <span className="text-defense-blue/80 font-bold">{drone.brand}</span> {drone.type}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-white/5 pt-2">
                      <div className="flex items-center gap-1.5">
                        <Target className="w-3 h-3 text-defense-green" />
                        <span className="text-white/80 tabular-nums">{drone.distance}m</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-3 h-3 text-defense-blue" />
                        <span className="text-white/80 tabular-nums">{drone.altitude}m</span>
                      </div>
                    </div>
                    {drone.id === activeDrone?.id && (
                        <motion.div layoutId="active-indicator" className="mt-2 text-[8px] text-defense-green animate-pulse flex items-center gap-1 uppercase tracking-widest font-bold">
                            <ChevronRight className="w-2 h-2" /> Live Tracking Active
                        </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {drones.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full opacity-20 py-10 scale-90 select-none">
                    <ShieldCheck className="w-12 h-12 mb-3 text-defense-green" />
                    <p className="text-xs font-mono text-center tracking-widest uppercase">Airspace Verified<br/>Sector: 1A-Gamma</p>
                  </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="h-auto bg-black/40 border border-defense-green/20 rounded-xl p-4 grid grid-cols-2 gap-2">
            <button className="flex flex-col items-center justify-center p-3 border border-defense-green/20 rounded hover:bg-defense-green/10 transition-colors group active:scale-95">
                <Wifi className="w-5 h-5 mb-1 group-hover:animate-bounce text-defense-green" />
                <span className="text-[9px] font-mono text-defense-green font-bold uppercase tracking-widest">Jammer</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 border border-defense-red/20 rounded hover:bg-defense-red/10 transition-colors group active:scale-95">
                <Target className="w-5 h-5 mb-1 text-defense-red group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-mono text-defense-red font-bold uppercase tracking-widest">Neutral</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 border border-defense-blue/20 rounded hover:bg-defense-blue/10 transition-colors group active:scale-95">
                <Cpu className="w-5 h-5 mb-1 text-defense-blue" />
                <span className="text-[9px] font-mono text-defense-blue font-bold uppercase tracking-widest">Smart AI</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 border border-white/10 rounded hover:bg-white/5 transition-colors group active:scale-95">
                <Settings className="w-5 h-5 mb-1 text-white/60" />
                <span className="text-[9px] font-mono text-white/40 font-bold uppercase tracking-widest">System</span>
            </button>
          </div>
        </aside>
      </main>

      {/* --- Global Emergency Overlay --- */}
      <AnimatePresence>
        {isAlert && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
            >
                <div className="absolute inset-0 bg-defense-red/10 animate-pulse border-[24px] border-defense-red/20" />
                <motion.div 
                   initial={{ scale: 0.5, rotate: -5 }}
                   animate={{ scale: 1.1, rotate: 0 }}
                   className="bg-defense-red p-8 border-4 border-white shadow-[0_0_50px_rgba(255,0,0,0.5)] z-50"
                >
                    <h2 className="text-5xl font-mono font-black text-white tracking-tighter uppercase italic drop-shadow-lg">
                        ⚠️ Violation Alert
                    </h2>
                    <p className="text-white font-mono text-center text-xs mt-2 tracking-[0.3em]">SECURE AIRSPACE BREACHED</p>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- Footer Status Bar --- */}
      <footer className="h-8 bg-defense-green/10 border-t border-defense-green/20 px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[9px] font-mono">
                <div className="w-1.5 h-1.5 bg-defense-green rounded-full animate-pulse shadow-[0_0_5px_#00ff41]" />
                <span className="text-defense-green/80 uppercase tracking-widest">Optical: Sync Status 100%</span>
            </div>
            <div className="flex items-center gap-2 text-[9px] font-mono">
                <div className="w-1.5 h-1.5 bg-defense-green rounded-full animate-pulse shadow-[0_0_5px_#00ff41]" />
                <span className="text-defense-green/80 uppercase tracking-widest">RF Backend: Active [2.4/5.8]</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[9px] font-mono">
                <div className="w-1.5 h-1.5 bg-defense-blue rounded-full animate-pulse" />
                <span className="text-defense-blue/80 uppercase tracking-widest">Sat-Link: Connected</span>
            </div>
        </div>
        <div className="text-[9px] font-mono text-defense-green/40 uppercase tracking-widest flex items-center gap-2">
            <Lock className="w-2.5 h-2.5" /> Secure Environment • Confidential Data • {new Date().toLocaleTimeString()}
        </div>
      </footer>
    </div>
  );
}
