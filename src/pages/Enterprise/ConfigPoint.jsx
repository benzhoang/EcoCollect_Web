import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import EnterpriseSidebar from '../../components/EnterpriseSidebar';
import ConfigPointModal from '../../components/Modal/ConfigPointModal';
import CancelRewardModal from '../../components/CancelRewardModal';
import {
    getEnterpriseRewardRules,
    getWasteCategories,
    toggleEnterpriseRewardRule,
    upsertEnterpriseRewardRuleByWasteCategory,
} from '../../service/api';

const ConfigPoint = () => {
    const [isSidebarOpen] = useState(true);
    const [rules, setRules] = useState([]);
    const [wasteCategories, setWasteCategories] = useState([]);
    const [loadingRules, setLoadingRules] = useState(false);
    const [rulesError, setRulesError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showToggleConfirmModal, setShowToggleConfirmModal] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [selectedRule, setSelectedRule] = useState(null);
    const [formData, setFormData] = useState({
        wasteCategoryId: '',
        pointsPerKg: 0,
        bonusQualityPoints: 0,
        bonusFastCompletePoints: 0,
        effectiveFrom: '',
        effectiveTo: '',
        priority: 0,
    });

    const normalizeListResponse = (res) => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.content)) return res.content;
        return [];
    };

    const toDateOnly = (iso) => {
        if (!iso) return '';
        return String(iso).split('T')[0];
    };

    const getWasteCategoryName = (id, categories = wasteCategories) => {
        if (!id) return '';
        const found = (Array.isArray(categories) ? categories : []).find((c) => c?.id === id);
        return found?.name || id;
    };

    const loadRewardRules = async (cancelledRef = { value: false }) => {
        setLoadingRules(true);
        setRulesError('');
        try {
            const [rulesRes, wasteCategoriesRes] = await Promise.all([
                getEnterpriseRewardRules(),
                getWasteCategories(),
            ]);

            const cats = normalizeListResponse(wasteCategoriesRes);
            if (!cancelledRef.value) setWasteCategories(cats);

            const list = normalizeListResponse(rulesRes);
            const mapped = list.map((r) => {
                const wasteCategoryId = r?.wasteCategoryId;
                const pointsPerKg = Number(r?.pointsPerKg ?? 0);
                const bonusQualityPoints = Number(r?.bonusQualityPoints ?? 0);
                const bonusFastCompletePoints = Number(r?.bonusFastCompletePoints ?? 0);
                const priority = Number(r?.priority ?? 0);
                const active = Boolean(r?.active);

                return {
                    id: r?.id,
                    type: 'enterprise_reward_rule',
                    name: `Quy tắc thưởng: ${wasteCategoryId ? getWasteCategoryName(wasteCategoryId, cats) : 'N/A'}`,
                    wasteCategoryId,
                    pointsPerKg,
                    bonusQualityPoints,
                    bonusFastCompletePoints,
                    effectiveFrom: r?.effectiveFrom,
                    effectiveTo: r?.effectiveTo,
                    priority,
                    isActive: active,
                    createdAt: toDateOnly(r?.createdAt),
                    updatedAt: toDateOnly(r?.updatedAt),
                    raw: r,
                };
            });

            if (!cancelledRef.value) setRules(mapped);
        } catch (err) {
            if (!cancelledRef.value) {
                setRules([]);
                setRulesError(err?.message || 'Không thể tải danh sách quy tắc thưởng.');
            }
        } finally {
            if (!cancelledRef.value) setLoadingRules(false);
        }
    };

    useEffect(() => {
        const cancelledRef = { value: false };
        loadRewardRules(cancelledRef);
        return () => {
            cancelledRef.value = true;
        };
    }, []);

    const wasteTypes = (Array.isArray(wasteCategories) ? wasteCategories : []).map((c) => ({
        value: c?.id,
        label: c?.name,
        color: 'bg-blue-100 text-blue-700',
    }));

    const emptyRuleFormData = {
        wasteCategoryId: '',
        pointsPerKg: 0,
        bonusQualityPoints: 0,
        bonusFastCompletePoints: 0,
        effectiveFrom: '',
        effectiveTo: '',
        priority: 0,
    };

    const handleOpenModal = (rule = null) => {
        if (rule) {
            setEditingRule(rule);
            setFormData({
                wasteCategoryId: rule.wasteCategoryId || '',
                pointsPerKg: Number(rule.pointsPerKg ?? 0),
                bonusQualityPoints: Number(rule.bonusQualityPoints ?? 0),
                bonusFastCompletePoints: Number(rule.bonusFastCompletePoints ?? 0),
                effectiveFrom: rule.effectiveFrom || '',
                effectiveTo: rule.effectiveTo || '',
                priority: Number(rule.priority ?? 0),
            });
        } else {
            setEditingRule(null);
            setFormData({ ...emptyRuleFormData });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingRule(null);
        setFormData({ ...emptyRuleFormData });
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
        }));
    };

    const handleConditionChange = () => {
        // Modal hiện tại không dùng conditions, giữ prop để tương thích interface cũ.
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const wasteCategoryId = String(formData.wasteCategoryId || '').trim();
            if (!wasteCategoryId) {
                throw new Error('Vui lòng chọn loại rác thải.');
            }

            const payload = {
                pointsPerKg: Number(formData.pointsPerKg ?? 0),
                bonusQualityPoints: Number(formData.bonusQualityPoints ?? 0),
                bonusFastCompletePoints: Number(formData.bonusFastCompletePoints ?? 0),
                effectiveFrom: formData.effectiveFrom,
                effectiveTo: formData.effectiveTo,
                priority: Number(formData.priority ?? 0),
            };

            await upsertEnterpriseRewardRuleByWasteCategory(wasteCategoryId, payload);
            await loadRewardRules({ value: false });
            toast.success(editingRule ? 'Cập nhật quy tắc thành công!' : 'Tạo quy tắc thành công!', { duration: 2500 });
            handleCloseModal();
        } catch (err) {
            toast.error(err?.message || 'Lưu quy tắc thất bại. Vui lòng thử lại.', { duration: 3500 });
        }
    };

    const handleOpenToggleConfirmModal = (rule) => {
        setSelectedRule(rule);
        setShowToggleConfirmModal(true);
    };

    const handleCloseToggleConfirmModal = () => {
        setSelectedRule(null);
        setShowToggleConfirmModal(false);
    };

    const handleToggleRuleActive = async () => {
        if (!selectedRule?.id) return;

        try {
            await toggleEnterpriseRewardRule(selectedRule.id);
            await loadRewardRules({ value: false });
            handleCloseToggleConfirmModal();
        } catch (err) {
            alert(err?.message || 'Bật/tắt reward rule thất bại. Vui lòng thử lại.');
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'enterprise_reward_rule':
                return 'Quy tắc thưởng';
            default:
                return type;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'enterprise_reward_rule':
                return 'bg-purple-100 text-purple-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const renderConditionDisplay = (rule) => {
        if (rule.type !== 'enterprise_reward_rule') return null;

        return (
            <div className="space-y-1">
                <div className="text-sm text-gray-600">
                    Danh mục rác: <span className="font-medium text-gray-900">{getWasteCategoryName(rule.wasteCategoryId)}</span>
                </div>
                <div className="text-sm text-gray-600">
                    Điểm/kg: <span className="font-medium text-gray-900">{rule.pointsPerKg}</span>
                    {rule.bonusQualityPoints ? (
                        <span className="ml-3 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                            +{rule.bonusQualityPoints} (chất lượng)
                        </span>
                    ) : null}
                    {rule.bonusFastCompletePoints ? (
                        <span className="ml-2 text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold">
                            +{rule.bonusFastCompletePoints} (nhanh)
                        </span>
                    ) : null}
                </div>
                <div className="text-sm text-gray-600">
                    Hiệu lực: <span className="font-medium text-gray-900">{toDateOnly(rule.effectiveFrom) || 'N/A'}</span>
                    {' '}→{' '}
                    <span className="font-medium text-gray-900">{toDateOnly(rule.effectiveTo) || 'N/A'}</span>
                </div>
                <div className="text-sm text-gray-600">
                    Priority: <span className="font-medium text-gray-900">{rule.priority}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
            <EnterpriseSidebar isOpen={isSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Cấu hình điểm thưởng</h1>
                            <p className="text-sm text-gray-600">Tạo và quản lý quy tắc tính điểm thưởng cho Citizen</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Tạo quy tắc mới</span>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Tổng quy tắc</p>
                                    <p className="text-2xl font-bold text-gray-900">{rules.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
                                    <p className="text-2xl font-bold text-green-600">{rules.filter((r) => r.isActive).length}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Đã tạm dừng</p>
                                    <p className="text-2xl font-bold text-gray-600">{rules.filter((r) => !r.isActive).length}</p>
                                </div>
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Tổng điểm/kg (active)</p>
                                    <p className="text-2xl font-bold text-orange-600">
                                        {rules.reduce((sum, rule) => sum + (rule.isActive ? Number(rule.pointsPerKg ?? 0) : 0), 0)}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Danh sách quy tắc</h2>
                            {loadingRules ? <p className="mt-1 text-sm text-gray-500">Đang tải dữ liệu...</p> : null}
                            {!loadingRules && rulesError ? <p className="mt-1 text-sm text-red-600">{rulesError}</p> : null}
                        </div>
                        <div className="divide-y divide-gray-200">
                            {rules.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-gray-600 mb-2">Chưa có quy tắc nào</p>
                                    <p className="text-sm text-gray-500">
                                        {loadingRules ? 'Vui lòng chờ tải dữ liệu...' : 'Không có dữ liệu.'}
                                    </p>
                                </div>
                            ) : (
                                rules.map((rule) => (
                                    <div key={rule.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(rule.type)}`}>
                                                        {getTypeLabel(rule.type)}
                                                    </span>
                                                    {rule.isActive ? (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                            Đang hoạt động
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                                            Đã tạm dừng
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mb-2">{renderConditionDisplay(rule)}</div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="font-semibold text-gray-900">{rule.pointsPerKg} điểm/kg</span>
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        Tạo ngày: {rule.createdAt || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button
                                                    onClick={() => handleOpenToggleConfirmModal(rule)}
                                                    className={`p-2 rounded-lg transition-colors ${rule.isActive ? 'text-gray-600 hover:bg-gray-100' : 'text-green-600 hover:bg-green-50'}`}
                                                    title={rule.isActive ? 'Tạm dừng reward rule' : 'Bật reward rule'}
                                                >
                                                    {rule.isActive ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ConfigPointModal
                show={showModal}
                editingRule={editingRule}
                formData={formData}
                wasteTypes={wasteTypes}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                onInputChange={handleInputChange}
                onConditionChange={handleConditionChange}
            />

            <CancelRewardModal
                show={showToggleConfirmModal}
                rule={selectedRule}
                onClose={handleCloseToggleConfirmModal}
                onConfirm={handleToggleRuleActive}
            />
        </div>
    );
};

export default ConfigPoint;
