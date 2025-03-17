import { useState, useEffect, useRef } from 'react';
import shivaImage from './assets/shiva.png';
import shivaVideo from './assets/shivaVideo.mp4';

const SanskritTerms = [
  "Veda", "Upaveda", "Vedāṅga", "Purāṇa", "Itihāsa", 
  "Darśana", "Smṛti", "Āgama", "Tantra", "Sūtra"
];

const ShivaCircles = () => {
  const [showContent, setShowContent] = useState(false);
  const [isRotationPaused, setIsRotationPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Ellipse dimensions
  const radiusX = 380;  // Horizontal radius
  const radiusY = 280;  // Vertical radius
  const animationDuration = 25;

  useEffect(() => {
    const hasSeenVideo = sessionStorage.getItem('hasSeenVideo');
    
    const handleVideoEnd = () => {
      sessionStorage.setItem('hasSeenVideo', 'true');
      setShowContent(true);
      setTimeout(() => setLoaded(true), 100);
      document.exitFullscreen();
    };

    if (!hasSeenVideo && videoRef.current) {
      const video = videoRef.current;
      
      const enterFullscreen = async () => {
        try {
          await video.requestFullscreen();
        } catch (error) {
          console.log('Fullscreen error:', error);
        }
      };

      video.muted = true;
      video.play()
        .then(() => enterFullscreen())
        .catch(error => {
          console.log('Autoplay prevented:', error);
          video.controls = true;
        });

      video.addEventListener('ended', handleVideoEnd);
    } else {
      setShowContent(true);
      setLoaded(true);
    }

    return () => {
      videoRef.current?.removeEventListener('ended', handleVideoEnd);
    };
  }, []);

  if (!showContent) {
    return (
      <video 
        ref={videoRef}
        style={styles.video}
        muted
        playsInline
        controls={false}
      >
        <source src={shivaVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <div style={{ ...styles.container, ...(loaded ? styles.containerVisible : {}) }}>
      <div 
        style={{ 
          ...styles.rotator,
          animation: `rotate ${animationDuration}s linear infinite`,
          animationPlayState: isRotationPaused ? 'paused' : 'running'
        }}
      >
        {SanskritTerms.map((term, index) => {
          const angle = (360 / SanskritTerms.length) * index;
          const radian = angle * (Math.PI / 180);
          const x = radiusX * Math.cos(radian);
          const y = radiusY * Math.sin(radian);
          
          return (
            <div
              key={term}
              style={{
                ...styles.circle,
                transform: `
                  translate(${x}px, ${y}px)
                  rotate(${-angle}deg)
                `,
                ...(loaded ? styles.circleVisible : {})
              }}
              onMouseEnter={() => setIsRotationPaused(true)}
              onMouseLeave={() => setIsRotationPaused(false)}
              onClick={() => console.log(`${term} selected`)}
            >
              <div style={styles.textContainer}>
                <span style={styles.sanskritText}>{term}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div style={{ ...styles.imageContainer, ...(loaded ? styles.imageVisible : {}) }}>
        <img 
          src={shivaImage} 
          alt="Lord Shiva" 
          style={styles.centerImage}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://cdni.iconscout.com/illustration/premium/thumb/lord-shiva-5259040-4401949.png';
          }}
        />
        <div style={styles.glowEffect}></div>
      </div>

      <style>
        {`
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes border-glow {
            0% { filter: drop-shadow(0 0 15px rgba(255,215,0,0.8)); }
            50% { filter: drop-shadow(0 0 25px rgba(255,140,0,0.9)); }
            100% { filter: drop-shadow(0 0 15px rgba(255,215,0,0.8)); }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  video: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    objectFit: 'cover',
    zIndex: 1000,
    backgroundColor: 'black'
  } as React.CSSProperties,
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #1a0a3d 0%, #2d0b5a 100%)',
    overflow: 'hidden',
    opacity: 0,
    transform: 'translateY(100vh) scale(0.5)',
    transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
  } as React.CSSProperties,
  containerVisible: {
    opacity: 1,
    transform: 'translateY(0) scale(1)',
  } as React.CSSProperties,
  rotator: {
    position: 'absolute',
    width: `${2 * 380}px`,
    height: `${2 * 280}px`,
    transformOrigin: 'center center',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  } as React.CSSProperties,
  circle: {
    position: 'absolute',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(145deg, rgba(255,215,0,0.9) 0%, rgba(255,140,0,0.9) 100%)',
    cursor: 'pointer',
    transformOrigin: 'center center',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 30px rgba(255,215,0,0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    transform: 'scale(0.5)',
    ':hover': {
      transform: 'scale(1.2)',
      boxShadow: '0 12px 40px rgba(255,140,0,0.5)',
      background: 'linear-gradient(145deg, rgba(255,140,0,0.9) 0%, rgba(255,215,0,0.9) 100%)',
    },
  } as React.CSSProperties,
  circleVisible: {
    opacity: 1,
    transform: 'scale(1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
  } as React.CSSProperties,
  textContainer: {
    textAlign: 'center' as const,
  },
  sanskritText: {
    color: '#2d1700',
    fontSize: '14px',
    fontWeight: '900',
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    textShadow: '0 2px 4px rgba(255,215,0,0.5)',
    whiteSpace: 'nowrap',
  },
  imageContainer: {
    position: 'relative',
    zIndex: 2,
    opacity: 0,
    transform: 'translateY(100px) scale(0.8)',
    transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s',
  } as React.CSSProperties,
  imageVisible: {
    opacity: 1,
    transform: 'translateY(0) scale(1)',
  } as React.CSSProperties,
  centerImage: {
    width: '750px',
    height: '500px',
    borderRadius: '375px / 250px',  // Elliptical shape
    objectFit: 'cover' as const,
    border: '4px solid rgba(255,215,0,0.9)',
    filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.6))',
    animation: 'border-glow 3s ease-in-out infinite',
  } as React.CSSProperties,
  glowEffect: {
    position: 'absolute',
    top: '-20px',
    left: '-20px',
    right: '-20px',
    bottom: '-20px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)',
    zIndex: -1,
    animation: 'border-glow 3s ease-in-out infinite',
  } as React.CSSProperties,
};

export default ShivaCircles;