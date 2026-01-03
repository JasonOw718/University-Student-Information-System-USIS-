import React from 'react';
import { Star, MoreVertical } from 'lucide-react';

interface CourseCardProps {
    code: string;
    title: string;
    creditHours: number;
    lecturerName: string;
    gradient: string; // e.g., "from-green-400 to-teal-500"
    role: 'student' | 'lecturer';
    menuItems?: {
        label: string;
        onClick?: () => void;
        className?: string;
        disabled?: boolean;
    }[];
    onClick?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
    code,
    title,
    creditHours,
    lecturerName,
    gradient,
    role,
    menuItems,
    onClick
}) => {
    const [showMenu, setShowMenu] = React.useState(false);

    return (
        <div
            className={`group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-visible flex flex-col h-full ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
            onMouseLeave={() => setShowMenu(false)}
            onClick={onClick}
            data-course-code={code}
        >
            {/* Card Header (Gradient/Image area) */}
            <div className={`h-32 bg-gradient-to-r ${gradient} relative p-4 rounded-t-lg`}>
                {/* Course Code Badge Removed */}
                <div className="flex justify-end items-start">
                    <span className="inline-block bg-[rgba(0,0,0,0.3)] backdrop-blur text-white text-xs font-semibold px-2 py-1 rounded">
                        {creditHours} Credits
                    </span>
                </div>

                {/* Optional Pattern Overlay */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '20px 20px'
                    }}>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    {/* Star Icon */}
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-[var(--primary)] fill-current flex-shrink-0" />
                        <h3 className="text-sm font-bold text-[var(--text-primary)] line-clamp-2 leading-tight uppercase">
                            {title}
                        </h3>
                    </div>
                    {/* Lecturer Info */}
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                        Lecturer: <span className="font-medium">{lecturerName}</span>
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end mt-4 relative">
                    <button
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                    >
                        <MoreVertical size={20} />
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 bottom-full mb-1 w-32 bg-white rounded-md shadow-lg border border-gray-100 z-10 overflow-hidden py-1">
                            {menuItems ? (
                                menuItems.map((item, index) => (
                                    <button
                                        key={index}
                                        disabled={item.disabled}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${item.disabled ? 'text-gray-400 cursor-not-allowed' : `hover:bg-gray-50 ${item.className || 'text-gray-700'}`}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!item.disabled) {
                                                setShowMenu(false);
                                                item.onClick && item.onClick();
                                            }
                                        }}
                                    >
                                        {item.label}
                                    </button>
                                ))
                            ) : (
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-[var(--danger)] hover:bg-red-50 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMenu(false);
                                    }}
                                >
                                    {role === 'student' ? 'Drop Course' : 'Delete'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
