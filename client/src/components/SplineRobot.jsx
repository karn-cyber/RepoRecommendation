import { useRef, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import './SplineRobot.css';

function SplineRobot() {
    const splineRef = useRef();
    const containerRef = useRef();

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!splineRef.current || !containerRef.current) return;

            const container = containerRef.current;
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            // Rotate the scene based on mouse position
            try {
                const obj = splineRef.current.findObjectByName('Scene');
                if (obj) {
                    obj.rotation.y = x * 0.5;
                    obj.rotation.x = -y * 0.3;
                }
            } catch (error) {
                // Silently handle if object not found
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, []);

    const onLoad = (spline) => {
        splineRef.current = spline;
    };

    return (
        <div ref={containerRef} className="spline-container">
            <Spline
                scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
                onLoad={onLoad}
            />
        </div>
    );
}

export default SplineRobot;
