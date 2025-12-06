import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
    const { user } = useAuth();

    // Gradient text for greeting
    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="min-h-screen pt-24 bg-slate-950 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
                    <div className="p-8 sm:p-12">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                                    {greeting()}, <br />
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                                        {user?.name}
                                    </span>
                                </h1>
                                <p className="mt-4 text-lg text-slate-400 max-w-2xl">
                                    Welcome to your dashboard. Here's an overview of your profile and account status.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-slate-800">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Card 1: User Info */}
                            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-colors group">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Profile Details</h3>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
                                        <p className="text-slate-200 font-medium break-all">{user?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">User ID</p>
                                        <p className="text-slate-200 font-mono text-xs">{user?.id}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Account Status */}
                            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-emerald-500/30 transition-colors group">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="p-3 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Account Status</h3>
                                </div>
                                <div className="flex items-center mt-2">
                                    <span className="flex h-3 w-3 relative mr-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-emerald-400 font-medium">Active</span>
                                </div>
                                <p className="mt-4 text-sm text-slate-400">
                                    Your account is fully verified and active.
                                </p>
                            </div>

                            {/* Card 3: Quick Stats (Placeholder) */}
                            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/30 transition-colors group">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Activity</h3>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-3xl font-bold text-white">0</p>
                                    <p className="text-sm text-slate-400">Recent actions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
