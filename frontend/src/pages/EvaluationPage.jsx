import React, { useEffect, useMemo, useState } from 'react';
import { Card, InputNumber, Button, Space, message } from 'antd';
import EvaluationForm from '../components/EvaluationForm';
import EvaluationCriteriaList from '../components/EvaluationCriteriaList';
import GradesSummary from '../components/GradesSummary';
import { addCriteriaScore, listCriteriaScores, updateCriteriaScore, getEvaluationSummary } from '../services/evaluationService';
import LecturerLayout from '../components/LecturerLayout';
import './EvaluationPage.css';

const EvaluationPage = () => {
    const [evaluationId, setEvaluationId] = useState(null);
    const [criteriaScores, setCriteriaScores] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(false);

    const autosaveKey = useMemo(() => (
        evaluationId ? `evaluation_autosave_${evaluationId}` : null
    ), [evaluationId]);

    const readAutosave = () => {
        if (!autosaveKey) return null;
        try {
            const raw = window.localStorage.getItem(autosaveKey);
            return raw ? JSON.parse(raw) : null;
        } catch (_err) {
            return null;
        }
    };

    const writeAutosave = (payload) => {
        if (!autosaveKey) return;
        window.localStorage.setItem(autosaveKey, JSON.stringify(payload));
    };

    const loadDetails = async (id) => {
        if (!id) return;
        try {
            const details = await listCriteriaScores(id);
            const saved = readAutosave();
            if (saved?.criteriaScores?.length) {
                setCriteriaScores(saved.criteriaScores);
            } else {
                setCriteriaScores(Array.isArray(details) ? details : []);
            }
        } catch (error) {
            message.error(error?.response?.data?.detail || 'Failed to load criteria scores');
        }
    };

    const loadSummary = async (id) => {
        if (!id) return;
        setLoadingSummary(true);
        try {
            const data = await getEvaluationSummary(id);
            setSummary(data);
        } catch (error) {
            message.error(error?.response?.data?.detail || 'Failed to load summary');
        } finally {
            setLoadingSummary(false);
        }
    };

    useEffect(() => {
        if (evaluationId) {
            loadDetails(evaluationId);
            loadSummary(evaluationId);
        }
    }, [evaluationId]);

    useEffect(() => {
        if (!evaluationId) return undefined;
        const timeout = window.setTimeout(() => {
            writeAutosave({
                criteriaScores,
                savedAt: new Date().toISOString()
            });
        }, 500);

        return () => window.clearTimeout(timeout);
    }, [evaluationId, criteriaScores]);

    const handleAddCriteria = async (payload) => {
        if (!evaluationId) {
            message.warning('Select evaluation first');
            return;
        }
        try {
            await addCriteriaScore(evaluationId, payload);
            await loadDetails(evaluationId);
            await loadSummary(evaluationId);
            message.success('Criteria score added');
        } catch (error) {
            message.error(error?.response?.data?.detail || 'Failed to add criteria score');
        }
    };

    const handleUpdateCriteria = async (item) => {
        if (!evaluationId) return;
        try {
            await updateCriteriaScore(evaluationId, item.criteria_id, {
                score: item.score,
                comment: item.comment
            });
            await loadDetails(evaluationId);
            await loadSummary(evaluationId);
            message.success('Criteria score updated');
        } catch (error) {
            message.error(error?.response?.data?.detail || 'Failed to update criteria score');
        }
    };

    const handleExportCsv = () => {
        if (!summary) {
            message.warning('No summary to export');
            return;
        }

        const rows = [];
        rows.push(['Evaluation ID', evaluationId]);
        rows.push(['Final Score', summary.final_score ?? '']);
        rows.push([]);
        rows.push(['Criteria', 'Weight', 'Score', 'Weighted Score']);
        (summary.criteria_scores || []).forEach((item) => {
            rows.push([
                item.criteria_name,
                item.weight,
                item.score,
                item.weighted_score
            ]);
        });

        const csv = rows.map((row) => row.map((cell) => {
            const value = cell ?? '';
            const escaped = String(value).replace(/"/g, '""');
            return `"${escaped}"`;
        }).join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `evaluation_${evaluationId || 'summary'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleChangeCriteria = (index, patch) => {
        setCriteriaScores((prev) => prev.map((item, idx) => (
            idx === index ? { ...item, ...patch } : item
        )));
    };

    return (
        <LecturerLayout>
            <div className="evaluation-page evaluation-page__content">
                <Card style={{ borderRadius: 16, marginBottom: 16 }}>
                    <Space align="center">
                        <InputNumber
                            min={1}
                            placeholder="Evaluation ID"
                            value={evaluationId}
                            onChange={setEvaluationId}
                        />
                        <Button onClick={() => evaluationId && loadDetails(evaluationId)}>Load</Button>
                        <Button onClick={handleExportCsv}>Export CSV</Button>
                    </Space>
                </Card>

                <div className="evaluation-page__grid">
                    <div className="evaluation-page__column">
                        <EvaluationForm onAdd={handleAddCriteria} />
                        <EvaluationCriteriaList
                            criteriaScores={criteriaScores}
                            onChange={handleChangeCriteria}
                            onSave={handleUpdateCriteria}
                        />
                    </div>
                    <div className="evaluation-page__column">
                        <Card style={{ borderRadius: 16, marginBottom: 16 }} loading={loadingSummary}>
                            <GradesSummary summary={summary} />
                        </Card>
                    </div>
                </div>
            </div>
        </LecturerLayout>
    );
};

export default EvaluationPage;
