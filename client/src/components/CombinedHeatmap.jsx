import React from 'react';
import './CombinedHeatmap.css';

const CombinedHeatmap = ({ data, year = new Date().getFullYear() }) => {
    // data is an object where keys are 'YYYY-MM-DD' and values are activity counts

    const generateCalendarGrid = () => {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        const days = [];

        // Adjust start date to the previous Sunday to align grid
        const dayOfWeek = startDate.getDay();
        const gridStartDate = new Date(startDate);
        gridStartDate.setDate(startDate.getDate() - dayOfWeek);

        let currentDate = new Date(gridStartDate);

        // Generate 53 weeks * 7 days
        for (let i = 0; i < 53 * 7; i++) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const count = data[dateStr] || 0;

            let level = 0;
            if (count > 0) level = 1;
            if (count > 2) level = 2;
            if (count > 5) level = 3;
            if (count > 10) level = 4;

            days.push({
                date: dateStr,
                count,
                level,
                inYear: currentDate.getFullYear() === year
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days;
    };

    const days = generateCalendarGrid();
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    return (
        <div className="heatmap-container">
            <div className="heatmap-grid">
                {weeks.map((week, wIndex) => (
                    <div key={wIndex} className="heatmap-week">
                        {week.map((day, dIndex) => (
                            <div
                                key={day.date}
                                className={`heatmap-day level-${day.level} ${!day.inYear ? 'dimmed' : ''}`}
                                title={`${day.count} activities on ${day.date}`}
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="heatmap-legend">
                <span>Less</span>
                <div className="heatmap-day level-0"></div>
                <div className="heatmap-day level-1"></div>
                <div className="heatmap-day level-2"></div>
                <div className="heatmap-day level-3"></div>
                <div className="heatmap-day level-4"></div>
                <span>More</span>
            </div>
        </div>
    );
};

export default CombinedHeatmap;
