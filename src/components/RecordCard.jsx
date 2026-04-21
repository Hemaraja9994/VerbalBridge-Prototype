import React, { useState, useEffect } from 'react';
import { Mic, Square, Play, RotateCcw, Waveform, Sparkles, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RecordCard = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, recording, processing, ready
  const [fragments, setFragments] = useState([]);
  
  const startRecording = () => {
    setIsRecording(true);
    setStatus('recording');
    // Simulate finding speech fragments
    const timer = setTimeout(() => {
        setFragments(['I... want...', 'to... go...', '...home']);
    }, 2000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setStatus('processing');
    
    // Simulate AI Regeneration
    setTimeout(() => {
      setStatus('ready');
    }, 3000);
  };

  const reset = () => {
    setStatus('idle');
    setFragments([]);
  };

  return (
    <div className="glass-card" style={{ padding: '2.5rem', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            color: 'var(--secondary)', 
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            Speech Session
          </span>
          <h2 style={{ fontSize: '1.75rem' }}>Adaptive AI Regeneration</h2>
        </div>
        <div style={{
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          background: status === 'recording' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-accent)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            background: status === 'recording' ? 'var(--error)' : 'var(--text-light)',
            animation: status === 'recording' ? 'pulse-soft 1s infinite' : 'none'
          }}></div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: status === 'recording' ? 'var(--error)' : 'var(--text-muted)' }}>
            {status === 'idle' && 'Ready to Start'}
            {status === 'recording' && 'Capturing Speech...'}
            {status === 'processing' && 'AI Regenerating...'}
            {status === 'ready' && 'Result Ready'}
          </span>
        </div>
      </div>

      {/* Main Display Area */}
      <div style={{
        height: '300px',
        background: 'var(--bg-accent)',
        borderRadius: 'var(--radius)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
                <Mic size={48} strokeWidth={1.5} />
              </div>
              <p>Press the button below to start capturing speech</p>
            </motion.div>
          )}

          {status === 'recording' && (
            <motion.div 
              key="recording"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ padding: '2rem', width: '100%' }}
            >
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [20, 60, 20] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                    style={{ width: '4px', background: 'var(--secondary)', borderRadius: '4px' }}
                  />
                ))}
              </div>
              <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                {fragments.map((f, i) => (
                  <motion.span 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'white', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '1.25rem' }}
                  >
                    {f}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {status === 'processing' && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                style={{ color: 'var(--secondary)', marginBottom: '1.5rem' }}
              >
                <Sparkles size={48} strokeWidth={1.5} />
              </motion.div>
              <h3 style={{ marginBottom: '0.5rem' }}>Analyzing Semantic Pathways</h3>
              <p>Reconstructing grammatical structures...</p>
            </motion.div>
          )}

          {status === 'ready' && (
            <motion.div 
              key="ready"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '2rem' }}
            >
              <div style={{ 
                background: 'var(--secondary-soft)', 
                padding: '2rem', 
                borderRadius: 'var(--radius)',
                border: '1px dashed var(--secondary)',
                marginBottom: '1.5rem'
              }}>
                <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ color: 'var(--secondary)', fontSize: '2.25rem' }}
                >
                  "I want to go home."
                </motion.h2>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-secondary">
                  <Play size={18} /> Play (1.0x)
                </button>
                <button className="btn btn-secondary">
                  <Volume2 size={18} /> Slow (0.75x)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {status === 'idle' && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
            style={{ height: '64px', width: '64px', borderRadius: '50%', padding: 0 }}
            onClick={startRecording}
          >
            <Mic size={24} />
          </motion.button>
        )}
        
        {status === 'recording' && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
            style={{ height: '64px', width: '64px', borderRadius: '50%', padding: 0, background: 'var(--error)' }}
            onClick={stopRecording}
          >
            <Square size={24} fill="white" />
          </motion.button>
        )}

        {(status === 'processing' || status === 'ready') && (
          <button 
            className="btn btn-outline"
            onClick={reset}
          >
            <RotateCcw size={18} /> New Session
          </button>
        )}
      </div>
    </div>
  );
};

export default RecordCard;
