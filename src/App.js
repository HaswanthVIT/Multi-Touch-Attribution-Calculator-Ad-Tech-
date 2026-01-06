import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Target, AlertCircle, Sparkles, Loader2, Brain, Plus, Trash2, BarChart3, Database, Info } from 'lucide-react';

// ⚠️ PASTE YOUR GEMINI API KEY HERE ⚠️
const GEMINI_API_KEY = 'AIzaSyBVbVoO883o1qUws2EMBIXE6e0wNFbIYhE';

const SAMPLE_CAMPAIGNS = [
  { channel: 'Google Search', impressions: 50000, clicks: 2500, cost: 5000, conversions: 125 },
  { channel: 'Facebook Ads', impressions: 80000, clicks: 3200, cost: 4000, conversions: 80 },
  { channel: 'Display Network', impressions: 120000, clicks: 2400, cost: 3000, conversions: 60 },
  { channel: 'Video Ads', impressions: 40000, clicks: 800, cost: 2500, conversions: 50 },
  { channel: 'Email Marketing', impressions: 25000, clicks: 1250, cost: 1000, conversions: 85 }
];

const generateUserJourneys = (channels) => {
  const journeys = [];
  const channelNames = channels.map(c => c.channel);
  
  for (let i = 1; i <= 100; i++) {
    const numTouchpoints = Math.floor(Math.random() * 4) + 1;
    const touchpoints = [];
    const timestamps = [];
    
    let currentDay = 0;
    for (let j = 0; j < numTouchpoints; j++) {
      touchpoints.push(channelNames[Math.floor(Math.random() * channelNames.length)]);
      currentDay += Math.floor(Math.random() * 3) + 1;
      timestamps.push(currentDay);
    }
    
    const converted = Math.random() > 0.6;
    const conversionValue = converted ? Math.floor(Math.random() * 150) + 50 : 0;
    
    journeys.push({
      userId: `User_${i}`,
      touchpoints,
      timestamps,
      converted,
      conversionValue
    });
  }
  
  return journeys;
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: '#DAE3F2',
    padding: '32px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  maxWidth: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  headerCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '48px',
    marginBottom: '24px',
    boxShadow: '0 4px 24px rgba(102, 126, 234, 0.08)',
    border: '1px solid rgba(102, 126, 234, 0.08)'
  },
  title: {
    fontSize: '48px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '12px',
    textAlign: 'center',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '18px',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '0',
    fontWeight: '500'
  },
  iconContainer: {
    display: 'inline-flex',
    padding: '24px',
    background: 'white',
    borderRadius: '24px',
    marginBottom: '32px',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
    border: '1px solid rgba(102, 126, 234, 0.1)'
  },
  formCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: '0 4px 24px rgba(102, 126, 234, 0.08)',
    border: '1px solid rgba(102, 126, 234, 0.08)'
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#202124',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  button: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
  },
  buttonHover: {
    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
    transform: 'translateY(-2px)'
  },
  input: {
    padding: '12px 16px',
    background: 'white',
    border: '1px solid #dadce0',
    borderRadius: '8px',
    color: '#202124',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease'
  },
  gridHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '16px',
    marginBottom: '16px',
    padding: '0 4px'
  },
  headerText: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#5f6368',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  campaignRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '16px',
    alignItems: 'center',
    padding: '12px 4px',
    marginBottom: '12px'
  },
  deleteButton: {
    padding: '10px',
    background: '#fce8e6',
    color: '#d93025',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s ease'
  },
  addButton: {
    width: '100%',
    padding: '16px',
    background: 'white',
    border: '2px dashed #dadce0',
    borderRadius: '8px',
    color: '#5f6368',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    marginTop: '8px'
  },
  analyzeButton: {
    width: '100%',
    marginTop: '32px',
    padding: '18px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginTop: '32px'
  },
  metricCard: {
    background: 'white',
    padding: '28px',
    borderRadius: '20px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  metricLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  metricValue: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#202124'
  },
  aiCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    border: 'none',
    padding: '36px',
    marginBottom: '24px',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.35)'
  },
  aiHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '24px'
  },
  aiIconBox: {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '12px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  aiTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '4px'
  },
  aiSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px'
  },
  aiContent: {
    background: '#f8f9fa',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #e8eaed'
  },
  aiText: {
    whiteSpace: 'pre-wrap',
    color: '#202124',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '15px',
    lineHeight: '1.8',
    letterSpacing: '0.2px'
  },
  modelButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    border: '1px solid #dadce0',
    transition: 'all 0.2s ease',
    marginRight: '12px',
    marginBottom: '12px'
  },
  modelButtonActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
  },
  modelButtonInactive: {
    background: 'white',
    color: '#5f6368',
    border: '1px solid #dadce0'
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0
  },
  th: {
    textAlign: 'left',
    padding: '16px',
    fontWeight: '600',
    color: '#5f6368',
    borderBottom: '2px solid #e8eaed',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  thRight: {
    textAlign: 'right',
    padding: '16px',
    fontWeight: '600',
    color: '#5f6368',
    borderBottom: '2px solid #e8eaed',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  td: {
    padding: '16px',
    fontWeight: '500',
    color: '#202124',
    borderBottom: '1px solid #f1f3f4'
  },
  tdRight: {
    padding: '16px',
    textAlign: 'right',
    color: '#202124',
    fontWeight: '500',
    borderBottom: '1px solid #f1f3f4'
  },
  tdRightGray: {
    padding: '16px',
    textAlign: 'right',
    color: '#5f6368',
    borderBottom: '1px solid #f1f3f4',
    fontWeight: '500'
  },
  chartContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
    marginBottom: '24px'
  },
  chartCard: {
    background: 'white',
    borderRadius: '24px',
    border: '1px solid rgba(102, 126, 234, 0.08)',
    padding: '32px',
    boxShadow: '0 4px 24px rgba(102, 126, 234, 0.08)'
  },
  chartTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#202124',
    marginBottom: '24px'
  },
  infoCard: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    borderRadius: '12px',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    padding: '20px'
  },
  infoContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px'
  },
  infoText: {
    color: '#667eea'
  },
  infoTitle: {
    fontWeight: '600',
    marginBottom: '8px',
    fontSize: '15px',
    color: '#667eea'
  },
  infoList: {
    fontSize: '14px',
    color: '#5f6368',
    lineHeight: '1.6'
  },
  explanationCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '40px',
    marginBottom: '24px',
    boxShadow: '0 4px 24px rgba(102, 126, 234, 0.08)',
    border: '1px solid rgba(102, 126, 234, 0.12)',
    borderLeft: '4px solid #667eea'
  },
  explanationTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  explanationText: {
    fontSize: '16px',
    color: '#5f6368',
    lineHeight: '1.8',
    marginBottom: '24px'
  },
  explanationSubtitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#202124',
    marginBottom: '16px'
  },
  explanationStep: {
    fontSize: '15px',
    color: '#5f6368',
    lineHeight: '1.7',
    marginBottom: '12px'
  },
  footer: {
    textAlign: 'center',
    color: '#5f6368',
    fontSize: '13px',
    marginTop: '32px'
  }
};

const AttributionCalculator = () => {
  const [showForm, setShowForm] = useState(true);
  const [campaigns, setCampaigns] = useState([
    { id: 1, channel: '', impressions: '', clicks: '', cost: '', conversions: '' }
  ]);
  const [analyzedCampaigns, setAnalyzedCampaigns] = useState(null);
  const [userJourneys, setUserJourneys] = useState(null);
  const [selectedModel, setSelectedModel] = useState('time-decay');
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const addCampaign = () => {
    setCampaigns([...campaigns, { 
      id: Date.now(), 
      channel: '', 
      impressions: '', 
      clicks: '', 
      cost: '', 
      conversions: '' 
    }]);
  };

  const removeCampaign = (id) => {
    if (campaigns.length > 1) {
      setCampaigns(campaigns.filter(c => c.id !== id));
    }
  };

  const updateCampaign = (id, field, value) => {
    setCampaigns(campaigns.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const loadSampleData = () => {
    const sampleWithIds = SAMPLE_CAMPAIGNS.map((camp, idx) => ({
      ...camp,
      id: idx + 1
    }));
    setCampaigns(sampleWithIds);
  };

  const analyzeCampaigns = () => {
    const validCampaigns = campaigns.filter(c => 
      c.channel && c.impressions && c.clicks && c.cost && c.conversions
    );

    if (validCampaigns.length === 0) {
      alert('Please enter at least one complete campaign with all fields filled.');
      return;
    }

    const processedCampaigns = validCampaigns.map(c => ({
      channel: c.channel,
      impressions: parseInt(c.impressions),
      clicks: parseInt(c.clicks),
      cost: parseInt(c.cost),
      conversions: parseInt(c.conversions)
    }));

    setAnalyzedCampaigns(processedCampaigns);
    setUserJourneys(generateUserJourneys(processedCampaigns));
    setShowForm(false);
    setAiRecommendation('');
  };

  const resetAnalysis = () => {
    setShowForm(true);
    setAnalyzedCampaigns(null);
    setUserJourneys(null);
    setAiRecommendation('');
  };

  const calculateAttributions = useMemo(() => {
    if (!analyzedCampaigns || !userJourneys) return {};

    const attributions = {
      'last-click': {},
      'first-click': {},
      'linear': {},
      'time-decay': {},
      'position-based': {}
    };

    analyzedCampaigns.forEach(camp => {
      Object.keys(attributions).forEach(model => {
        attributions[model][camp.channel] = 0;
      });
    });

    userJourneys.filter(j => j.converted).forEach(journey => {
      const { touchpoints, timestamps, conversionValue } = journey;
      const numTouchpoints = touchpoints.length;

      attributions['last-click'][touchpoints[numTouchpoints - 1]] += conversionValue;
      attributions['first-click'][touchpoints[0]] += conversionValue;

      touchpoints.forEach(channel => {
        attributions['linear'][channel] += conversionValue / numTouchpoints;
      });

      let totalWeight = 0;
      const weights = timestamps.map((_, idx) => {
        const weight = Math.pow(2, idx);
        totalWeight += weight;
        return weight;
      });
      touchpoints.forEach((channel, idx) => {
        attributions['time-decay'][channel] += (weights[idx] / totalWeight) * conversionValue;
      });

      if (numTouchpoints === 1) {
        attributions['position-based'][touchpoints[0]] += conversionValue;
      } else if (numTouchpoints === 2) {
        attributions['position-based'][touchpoints[0]] += conversionValue * 0.5;
        attributions['position-based'][touchpoints[1]] += conversionValue * 0.5;
      } else {
        attributions['position-based'][touchpoints[0]] += conversionValue * 0.4;
        attributions['position-based'][touchpoints[numTouchpoints - 1]] += conversionValue * 0.4;
        const middleCredit = (conversionValue * 0.2) / (numTouchpoints - 2);
        for (let i = 1; i < numTouchpoints - 1; i++) {
          attributions['position-based'][touchpoints[i]] += middleCredit;
        }
      }
    });

    return attributions;
  }, [analyzedCampaigns, userJourneys]);

  const calculateROI = useMemo(() => {
    if (!analyzedCampaigns || !calculateAttributions) return [];

    const roiData = analyzedCampaigns.map(campaign => {
      const result = { channel: campaign.channel, cost: campaign.cost };
      
      Object.keys(calculateAttributions).forEach(model => {
        const revenue = calculateAttributions[model][campaign.channel] || 0;
        const roi = campaign.cost > 0 ? ((revenue - campaign.cost) / campaign.cost) * 100 : 0;
        result[model] = {
          revenue: Math.round(revenue),
          roi: Math.round(roi * 10) / 10
        };
      });
      
      return result;
    });
    
    return roiData;
  }, [analyzedCampaigns, calculateAttributions]);

  const tableData = useMemo(() => {
    if (!calculateROI.length) return [];
    return calculateROI.map(row => ({
      channel: row.channel,
      cost: row.cost,
      lastClick: row['last-click'].revenue,
      firstClick: row['first-click'].revenue,
      linear: row['linear'].revenue,
      timeDecay: row['time-decay'].revenue,
      positionBased: row['position-based'].revenue,
      selectedROI: row[selectedModel].roi
    }));
  }, [calculateROI, selectedModel]);

  const chartData = useMemo(() => {
    if (!calculateROI.length) return [];
    return calculateROI.map(row => ({
      channel: row.channel.split(' ')[0],
      'Last-Click': row['last-click'].revenue,
      'First-Click': row['first-click'].revenue,
      'Linear': row['linear'].revenue,
      'Time-Decay': row['time-decay'].revenue,
      'Position-Based': row['position-based'].revenue
    }));
  }, [calculateROI]);

  const roiChartData = useMemo(() => {
    if (!calculateROI.length) return [];
    return calculateROI.map(row => ({
      channel: row.channel.split(' ')[0],
      roi: row[selectedModel].roi
    }));
  }, [calculateROI, selectedModel]);

  const getAIRecommendation = async () => {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
      setAiRecommendation('⚠️ ERROR: Please add your Gemini API key at the top of the App.js file.\n\nGet your key from: https://aistudio.google.com/app/apikey');
      return;
    }

    setIsLoadingAI(true);
    setAiRecommendation('');

    try {
      const dataSummary = {
        totalRevenue: userJourneys.reduce((sum, j) => sum + j.conversionValue, 0),
        totalSpend: analyzedCampaigns.reduce((sum, c) => sum + c.cost, 0),
        totalConversions: userJourneys.filter(j => j.converted).length,
        selectedModel: selectedModel,
        channelPerformance: calculateROI.map(row => ({
          channel: row.channel,
          cost: row.cost,
          revenue: row[selectedModel].revenue,
          roi: row[selectedModel].roi,
          impressions: analyzedCampaigns.find(c => c.channel === row.channel).impressions,
          clicks: analyzedCampaigns.find(c => c.channel === row.channel).clicks,
          conversions: analyzedCampaigns.find(c => c.channel === row.channel).conversions,
          ctr: ((analyzedCampaigns.find(c => c.channel === row.channel).clicks / analyzedCampaigns.find(c => c.channel === row.channel).impressions) * 100).toFixed(2)
        }))
      };

      const prompt = `You are an expert digital marketing strategist. Analyze this campaign data and provide SPECIFIC budget allocation recommendations.

CAMPAIGN OVERVIEW:
- Total Revenue: $${dataSummary.totalRevenue.toLocaleString()}
- Total Spend: $${dataSummary.totalSpend.toLocaleString()}
- Overall ROI: ${(((dataSummary.totalRevenue - dataSummary.totalSpend) / dataSummary.totalSpend) * 100).toFixed(1)}%
- Total Conversions: ${dataSummary.totalConversions}
- Attribution Model: ${selectedModel.toUpperCase()}

CHANNEL PERFORMANCE:
${dataSummary.channelPerformance.map(ch => 
  `\n${ch.channel}:
  • Current Spend: $${ch.cost.toLocaleString()}
  • Revenue (${selectedModel}): $${ch.revenue.toLocaleString()}
  • ROI: ${ch.roi}%
  • CTR: ${ch.ctr}%
  • Conversions: ${ch.conversions}`
).join('\n')}

YOUR TASK:
Provide a clear, actionable budget allocation strategy in this EXACT format :

RECOMMENDED BUDGET ALLOCATION STRATEGY:

  [Provide 3-4 specific actions with dollar amounts]

PROJECTED IMPACT:
  [Expected results]

Keep it under 250 words, be specific with numbers.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || 'Invalid API key'}`);
      }

      const data = await response.json();
      const aiText = data.candidates[0].content.parts[0].text;
      
      // Format the AI text with better styling
      const formattedText = aiText
        .replace(/🎯/g, '\n🎯')
        .replace(/💰/g, '\n💰')
        .replace(/\*\*/g, '')
        .trim();
      
      setAiRecommendation(formattedText);
    } catch (error) {
      setAiRecommendation(`❌ ERROR: ${error.message}\n\nPlease verify your API key at: https://aistudio.google.com/app/apikey`);
    } finally {
      setIsLoadingAI(false);
    }
  };

  if (showForm) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.maxWidth}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <svg width="0" height="0" style={{ position: 'absolute' }}>
              <defs>
                <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={styles.iconContainer}>
                <BarChart3 size={56} color="#667eea" />
              </div>
            </div>
            <h1 style={styles.title}>Multi-Touch Attribution Calculator</h1>
            <p style={styles.subtitle}>AI-powered campaign analysis with intelligent budget recommendations</p>
          </div>

          {/* Explanation Section */}
          <div style={styles.explanationCard}>
            <h2 style={styles.explanationTitle}>
              <Info size={28} color="#667eea" />
              What is Multi-Touch Attribution?
            </h2>
            <p style={styles.explanationText}>
              Multi-Touch Attribution helps you understand which marketing channels contribute to conversions. Instead of giving all credit to the last click, this tool analyzes the entire customer journey across multiple touchpoints to show you where your budget is most effective.
            </p>
            
            <h3 style={styles.explanationSubtitle}>How This Tool Works:</h3>
            <div>
              <p style={styles.explanationStep}>
                <strong style={{ color: '#202124' }}>1. Enter Your Data:</strong> Add campaign metrics (impressions, clicks, cost, conversions) for each marketing channel
              </p>
              <p style={styles.explanationStep}>
                <strong style={{ color: '#202124' }}>2. Choose Attribution Model:</strong> Select how credit is distributed across touchpoints (Last-Click, Linear, Time-Decay, etc.)
              </p>
              <p style={styles.explanationStep}>
                <strong style={{ color: '#202124' }}>3. Get AI Insights:</strong> Our AI analyzes your data and provides budget allocation recommendations to maximize ROI
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>
                <Database size={28} color="#667eea" />
                Enter Campaign Data
              </h2>
              <button 
                style={styles.button}
                onClick={loadSampleData}
                onMouseEnter={(e) => e.target.style.background = '#1765cc'}
                onMouseLeave={(e) => e.target.style.background = '#1a73e8'}
              >
                Load Sample Data
              </button>
            </div>

            <div style={styles.gridHeader}>
              <div style={styles.headerText}>Channel Name</div>
              <div style={styles.headerText}>Impressions</div>
              <div style={styles.headerText}>Clicks</div>
              <div style={styles.headerText}>Cost ($)</div>
              <div style={styles.headerText}>Conversions</div>
              <div></div>
            </div>

            {campaigns.map((campaign) => (
              <div key={campaign.id} style={styles.campaignRow}>
                <input
                  type="text"
                  placeholder="Google Ads"
                  value={campaign.channel}
                  onChange={(e) => updateCampaign(campaign.id, 'channel', e.target.value)}
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
                  onBlur={(e) => e.target.style.borderColor = '#dadce0'}
                />
                <input
                  type="number"
                  placeholder="50000"
                  value={campaign.impressions}
                  onChange={(e) => updateCampaign(campaign.id, 'impressions', e.target.value)}
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
                  onBlur={(e) => e.target.style.borderColor = '#dadce0'}
                />
                <input
                  type="number"
                  placeholder="2500"
                  value={campaign.clicks}
                  onChange={(e) => updateCampaign(campaign.id, 'clicks', e.target.value)}
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
                  onBlur={(e) => e.target.style.borderColor = '#dadce0'}
                />
                <input
                  type="number"
                  placeholder="5000"
                  value={campaign.cost}
                  onChange={(e) => updateCampaign(campaign.id, 'cost', e.target.value)}
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
                  onBlur={(e) => e.target.style.borderColor = '#dadce0'}
                />
                <input
                  type="number"
                  placeholder="125"
                  value={campaign.conversions}
                  onChange={(e) => updateCampaign(campaign.id, 'conversions', e.target.value)}
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
                  onBlur={(e) => e.target.style.borderColor = '#dadce0'}
                />
                <button
                  onClick={() => removeCampaign(campaign.id)}
                  disabled={campaigns.length === 1}
                  style={{...styles.deleteButton, opacity: campaigns.length === 1 ? 0.3 : 1, cursor: campaigns.length === 1 ? 'not-allowed' : 'pointer'}}
                  onMouseEnter={(e) => campaigns.length > 1 && (e.target.style.background = '#fad2cf')}
                  onMouseLeave={(e) => e.target.style.background = '#fce8e6'}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}

            <button 
              style={styles.addButton} 
              onClick={addCampaign}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#1a73e8';
                e.target.style.color = '#1a73e8';
                e.target.style.background = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#dadce0';
                e.target.style.color = '#5f6368';
                e.target.style.background = 'white';
              }}
            >
              <Plus size={20} />
              Add Another Campaign
            </button>

            <button 
              style={styles.analyzeButton} 
              onClick={analyzeCampaigns}
              onMouseEnter={(e) => {
                e.target.style.background = '#1765cc';
                e.target.style.boxShadow = '0 4px 8px rgba(26, 115, 232, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#1a73e8';
                e.target.style.boxShadow = '0 2px 6px rgba(26, 115, 232, 0.3)';
              }}
            >
              🚀 Analyze Campaigns & Generate Insights
            </button>
          </div>

          {/* Info Card */}
          <div style={styles.infoCard}>
            <div style={styles.infoContent}>
              <AlertCircle color="#667eea" size={24} style={{ flexShrink: 0 }} />
              <div style={styles.infoText}>
                <p style={styles.infoTitle}>Quick Guide:</p>
                <div style={styles.infoList}>
                  • Enter your campaign data manually or click "Load Sample Data"<br/>
                  • Fill in all fields: Channel name, Impressions, Clicks, Cost, and Conversions<br/>
                  • Add multiple campaigns using "+ Add Another Campaign"<br/>
                  • Click "Analyze Campaigns" to see attribution models and AI recommendations
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results View
  return (
    <div style={styles.pageContainer}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.headerCard}>
          <div style={styles.formHeader}>
            <div>
              <h1 style={{...styles.title, textAlign: 'left', fontSize: '36px', marginBottom: '8px'}}>
                Attribution Analysis Results
              </h1>
              <p style={{...styles.subtitle, textAlign: 'left', fontSize: '16px', margin: 0}}>
                AI-powered insights across {analyzedCampaigns?.length} channels
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={getAIRecommendation}
                disabled={isLoadingAI}
                style={{
                  padding: '12px 24px',
                  background: isLoadingAI ? '#dadce0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: isLoadingAI ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => !isLoadingAI && (e.target.style.background = 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)')}
                onMouseLeave={(e) => !isLoadingAI && (e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)')}
              >
                {isLoadingAI ? (
                  <>
                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain size={20} />
                    AI Recommendations
                  </>
                )}
              </button>
              <button
                onClick={resetAnalysis}
                style={{
                  padding: '12px 24px',
                  background: 'white',
                  color: '#5f6368',
                  border: '1px solid #dadce0',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.background = 'white'}
              >
                ← Edit Data
              </button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px 20px 0 0' }}></div>
              <div style={{...styles.metricLabel, color: '#667eea'}}>
                <Target size={20} />
                Total Conversions
              </div>
              <p style={styles.metricValue}>
                {userJourneys?.filter(j => j.converted).length || 0}
              </p>
            </div>
            <div style={styles.metricCard}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', borderRadius: '20px 20px 0 0' }}></div>
              <div style={{...styles.metricLabel, color: '#188038'}}>
                <DollarSign size={20} />
                Total Revenue
              </div>
              <p style={styles.metricValue}>
                ${userJourneys?.reduce((sum, j) => sum + j.conversionValue, 0).toLocaleString() || 0}
              </p>
            </div>
            <div style={styles.metricCard}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)', borderRadius: '20px 20px 0 0' }}></div>
              <div style={{...styles.metricLabel, color: '#9334e6'}}>
                <TrendingUp size={20} />
                Total Spend
              </div>
              <p style={styles.metricValue}>
                ${analyzedCampaigns?.reduce((sum, c) => sum + c.cost, 0).toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        {aiRecommendation && (
          <div style={styles.aiCard}>
            <div style={styles.aiHeader}>
              <div style={styles.aiIconBox}>
                <Sparkles color="#667eea" size={28} />
              </div>
              <div>
                <h2 style={styles.aiTitle}>AI Budget Strategy</h2>
                <p style={styles.aiSubtitle}>Based on {selectedModel} attribution model</p>
              </div>
            </div>
            
            <div style={styles.aiContent}>
              <pre style={styles.aiText}>{aiRecommendation}</pre>
            </div>
          </div>
        )}

        {/* Attribution Model Selector */}
        <div style={styles.formCard}>
          <h2 style={{...styles.formTitle, marginBottom: '24px'}}>Attribution Model</h2>
          <div>
            {['last-click', 'first-click', 'linear', 'time-decay', 'position-based'].map(model => (
              <button
                key={model}
                onClick={() => setSelectedModel(model)}
                style={selectedModel === model ? {...styles.modelButton, ...styles.modelButtonActive} : {...styles.modelButton, ...styles.modelButtonInactive}}
                onMouseEnter={(e) => {
                  if (selectedModel !== model) {
                    e.target.style.background = '#f8f9fa';
                    e.target.style.borderColor = '#1a73e8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedModel !== model) {
                    e.target.style.background = 'white';
                    e.target.style.borderColor = '#dadce0';
                  }
                }}
              >
                {model.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Attribution Table */}
        <div style={styles.formCard}>
          <h2 style={{...styles.formTitle, marginBottom: '24px'}}>Revenue Attribution by Model</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Channel</th>
                  <th style={styles.thRight}>Cost</th>
                  <th style={styles.thRight}>Last-Click</th>
                  <th style={styles.thRight}>First-Click</th>
                  <th style={styles.thRight}>Linear</th>
                  <th style={styles.thRight}>Time-Decay</th>
                  <th style={styles.thRight}>Position-Based</th>
                  <th style={styles.thRight}>ROI ({selectedModel})</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#fafafa' : 'white' }}>
                    <td style={styles.td}>{row.channel}</td>
                    <td style={styles.tdRightGray}>${row.cost.toLocaleString()}</td>
                    <td style={styles.tdRight}>${row.lastClick.toLocaleString()}</td>
                    <td style={styles.tdRight}>${row.firstClick.toLocaleString()}</td>
                    <td style={styles.tdRight}>${row.linear.toLocaleString()}</td>
                    <td style={styles.tdRight}>${row.timeDecay.toLocaleString()}</td>
                    <td style={styles.tdRight}>${row.positionBased.toLocaleString()}</td>
                    <td style={{...styles.tdRight, color: row.selectedROI >= 0 ? '#188038' : '#d93025', fontWeight: '700', fontSize: '16px'}}>
                      {row.selectedROI}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts */}
        <div style={styles.chartContainer}>
          <div style={styles.chartCard}>
            <h2 style={styles.chartTitle}>Revenue by Attribution Model</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" />
                <XAxis dataKey="channel" stroke="#5f6368" style={{ fontSize: '12px' }} />
                <YAxis stroke="#5f6368" style={{ fontSize: '12px' }} />
                <Tooltip 
                  formatter={(value) => `$${value}`}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e8eaed', borderRadius: '8px', fontSize: '13px' }}
                />
                <Legend wrapperStyle={{ fontSize: '13px' }} />
                <Bar dataKey="Last-Click" fill="#667eea" radius={[4, 4, 0, 0]} />
                <Bar dataKey="First-Click" fill="#764ba2" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Linear" fill="#f093fb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Time-Decay" fill="#4facfe" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Position-Based" fill="#43e97b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chartCard}>
            <h2 style={styles.chartTitle}>ROI Comparison ({selectedModel})</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={roiChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" />
                <XAxis dataKey="channel" stroke="#5f6368" style={{ fontSize: '12px' }} />
                <YAxis stroke="#5f6368" style={{ fontSize: '12px' }} />
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e8eaed', borderRadius: '8px', fontSize: '13px' }}
                />
                <Bar dataKey="roi" fill="#667eea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer */}
        <p style={styles.footer}>
          Analyzing {userJourneys?.length || 0} user journeys across {analyzedCampaigns?.length || 0} channels | Powered by Google Gemini AI
        </p>
      </div>
    </div>
  );
};

