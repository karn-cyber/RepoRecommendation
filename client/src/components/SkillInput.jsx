import { useState } from 'react';
import { X } from 'lucide-react';
import './SkillInput.css';

function SkillInput({ selectedSkills, onSkillAdd, onSkillRemove }) {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            onSkillAdd(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <div className="skill-input-container">
            <div className="skill-input-wrapper">
                <div className="selected-skills">
                    {selectedSkills.map((skill, index) => (
                        <div key={index} className="tag">
                            {skill}
                            <button
                                className="tag-remove"
                                onClick={() => onSkillRemove(skill)}
                                aria-label={`Remove ${skill}`}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    className="input skill-input"
                    placeholder={selectedSkills.length === 0 ? "Enter your skills (e.g., JavaScript, Python)..." : "Add more skills..."}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <p className="input-hint">
                💡 Press Enter to add a skill
            </p>
        </div>
    );
}

export default SkillInput;
