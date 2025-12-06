interface AlertProps {
    type: 'error' | 'success';
    message: string;
}

export const Alert = ({ type, message }: AlertProps) => {
    if (!message) return null;

    const styles = {
        error: 'bg-red-500/10 border-red-500/20 text-red-400',
        success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    };

    return (
        <div className={`p-4 rounded-lg border ${styles[type]} text-sm mb-6 flex items-center animate-in fade-in slide-in-from-top-2`}>
            <svg
                className="w-5 h-5 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                {type === 'error' ? (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                ) : (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                    />
                )}
            </svg>
            {message}
        </div>
    );
};
