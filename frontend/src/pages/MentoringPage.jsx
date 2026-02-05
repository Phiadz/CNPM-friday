import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { teamService } from '../services/api';
import MentoringDashboard from '../components/MentoringDashboard';
import LecturerLayout from '../components/LecturerLayout';
import './MentoringPage.css';

const MentoringPage = () => {
    const { user } = useAuth();
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            if (!user) return;
            try {
                const res = await teamService.getAll();
                setTeams(res.data?.teams || res.data || []);
            } catch (_err) {
                setTeams([]);
            }
        };
        fetchTeams();
    }, [user]);

    return (
        <LecturerLayout>
            <div className="mentoring-page mentoring-page__content">
                <MentoringDashboard teams={teams} />
            </div>
        </LecturerLayout>
    );
};

export default MentoringPage;
