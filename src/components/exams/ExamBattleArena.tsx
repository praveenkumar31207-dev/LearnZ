'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { BattleChallenger, BattleQuestion } from '@/types';
import {
  Swords,
  Shield,
  Zap,
  Flame,
  Trophy,
  Crown,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  Award,
  Users,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ExamBattleArena: React.FC = () => {
  const {
    challengers,
    battleQuestions,
    studentBattleProfile,
    recordBattleVictory,
  } = useAppStore();

  const [gameState, setGameState] = useState<'lobby' | 'matchmaking' | 'battle' | 'results'>('lobby');
  const [selectedChallenger, setSelectedChallenger] = useState<BattleChallenger | null>(challengers[0] || null);
  const [roundIdx, setRoundIdx] = useState(0);
  const [roundTimeLeft, setRoundTimeLeft] = useState(15);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [userStreak, setUserStreak] = useState(0);
  const [opponentStreak, setOpponentStreak] = useState(0);
  const [userSelectedOption, setUserSelectedOption] = useState<string | null>(null);
  const [opponentSelectedOption, setOpponentSelectedOption] = useState<string | null>(null);
  const [roundEnded, setRoundEnded] = useState(false);
  const [userTimeTaken, setUserTimeTaken] = useState(0);

  // 5 rounds per battle
  const totalRounds = 5;
  const currentQuestions = battleQuestions.slice(0, totalRounds);
  const currentQ: BattleQuestion = currentQuestions[roundIdx] || currentQuestions[0];

  // Matchmaking animation timer
  useEffect(() => {
    if (gameState === 'matchmaking') {
      const timer = setTimeout(() => {
        setRoundIdx(0);
        setUserScore(0);
        setOpponentScore(0);
        setUserStreak(0);
        setOpponentStreak(0);
        setUserSelectedOption(null);
        setOpponentSelectedOption(null);
        setRoundEnded(false);
        setRoundTimeLeft(15);
        setGameState('battle');
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  // Round Timer & Opponent Simulation
  useEffect(() => {
    let timer: any = null;
    if (gameState === 'battle' && !roundEnded && roundTimeLeft > 0) {
      timer = setInterval(() => {
        setRoundTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (gameState === 'battle' && roundTimeLeft === 0 && !roundEnded) {
      handleEndRound(null);
    }
    return () => clearInterval(timer);
  }, [gameState, roundEnded, roundTimeLeft]);

  // Opponent AI answer simulation (between 2.5s and 5.5s)
  useEffect(() => {
    if (gameState === 'battle' && !roundEnded) {
      const opponentWinProbability = selectedChallenger?.tier === 'Grandmaster' ? 0.85 : selectedChallenger?.tier === 'Diamond' ? 0.75 : 0.65;
      const delay = Math.floor(Math.random() * 3000) + 2000;

      const oppTimer = setTimeout(() => {
        if (!roundEnded) {
          const isCorrect = Math.random() < opponentWinProbability;
          const chosen = isCorrect
            ? currentQ.correctAnswer
            : currentQ.options.find((o) => o !== currentQ.correctAnswer) || currentQ.options[0];

          setOpponentSelectedOption(chosen);

          if (isCorrect) {
            const oppSpeedBonus = Math.floor(Math.random() * 40) + 10;
            const oppPts = currentQ.points + oppSpeedBonus;
            setOpponentScore((prev) => prev + oppPts);
            setOpponentStreak((prev) => prev + 1);
          } else {
            setOpponentStreak(0);
          }
        }
      }, delay);

      return () => clearTimeout(oppTimer);
    }
  }, [gameState, roundIdx, roundEnded]);

  const handleStartMatchmaking = (challenger?: BattleChallenger) => {
    if (challenger) setSelectedChallenger(challenger);
    setGameState('matchmaking');
  };

  const handleUserAnswer = (option: string) => {
    if (userSelectedOption || roundEnded) return;
    setUserSelectedOption(option);
    const timeSpent = 15 - roundTimeLeft;
    setUserTimeTaken(timeSpent);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      // Speed bonus: faster answer yields more points
      const speedBonus = Math.max(0, Math.round((roundTimeLeft / 15) * 50));
      const points = currentQ.points + speedBonus;
      setUserScore((prev) => prev + points);
      setUserStreak((prev) => prev + 1);
    } else {
      setUserStreak(0);
    }

    // End round after a brief pause so player sees result
    setTimeout(() => {
      handleEndRound(option);
    }, 1200);
  };

  const handleEndRound = (userChoice: string | null) => {
    setRoundEnded(true);

    setTimeout(() => {
      if (roundIdx < totalRounds - 1) {
        setRoundIdx((prev) => prev + 1);
        setUserSelectedOption(null);
        setOpponentSelectedOption(null);
        setRoundEnded(false);
        setRoundTimeLeft(15);
      } else {
        // Match Finished
        handleFinishMatch();
      }
    }, 1600);
  };

  const handleFinishMatch = () => {
    const isVictory = userScore >= opponentScore;
    const eloDelta = isVictory ? +32 : -14;
    const xpDelta = isVictory ? 150 : 50;

    recordBattleVictory(isVictory, eloDelta, xpDelta, {
      opponentName: selectedChallenger?.name || 'Rival Student',
      opponentAvatar: selectedChallenger?.avatarEmoji || '⚡',
      opponentTier: selectedChallenger?.tier || 'Diamond',
      userScore,
      opponentScore,
      subject: currentQ.subject,
    });

    if (isVictory) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }

    setGameState('results');
  };

  // 1. Lobby Screen
  if (gameState === 'lobby') {
    return (
      <div className="space-y-6 animate-in fade-in">
        {/* Banner Hero */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white border border-indigo-800/80 p-6 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-rose-400" />
              Live 1v1 Exam War Arena
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Head-to-Head Live Exam Battles ⚔️
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Step into the combat ring! Challenge peers and rival students to 5-round high-speed conceptual clashes. Earn Elo rating rank points, climb leaderboards, and showcase your mastery card.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => handleStartMatchmaking(challengers[0])}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-indigo-600 to-teal-500 hover:from-rose-500 hover:to-teal-400 text-white font-black text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
              >
                <Swords className="w-4 h-4" />
                <span>QUICK MATCH BATTLE</span>
              </button>

              <div className="text-xs text-slate-400">
                Current Elo: <span className="font-extrabold text-amber-400">{studentBattleProfile.eloRating} ({studentBattleProfile.tier})</span>
              </div>
            </div>
          </div>

          <div className="w-48 h-48 rounded-3xl bg-white/5 border border-white/10 p-4 flex flex-col items-center justify-center text-center space-y-2 shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center text-3xl shadow-lg">
              {studentBattleProfile.avatarEmoji}
            </div>
            <div>
              <h4 className="text-sm font-black text-white">{studentBattleProfile.fullName}</h4>
              <span className="text-[10px] text-amber-400 font-bold uppercase">{studentBattleProfile.tier} Tier</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">
              {studentBattleProfile.wins}W - {studentBattleProfile.losses}L ({studentBattleProfile.winRate}%)
            </span>
          </div>
        </div>

        {/* Live Challenger Lobby List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Online Peer Challengers
              </h3>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {challengers.length} Challengers Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challengers.map((chal) => (
              <div
                key={chal.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl border border-indigo-200 dark:border-indigo-800">
                        {chal.avatarEmoji}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{chal.name}</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        </h4>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          @{chal.handle} • {chal.university}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-slate-500">Elo Rating:</span>
                      <span className="font-extrabold text-amber-600 dark:text-amber-400">
                        {chal.eloRating} ({chal.tier})
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-slate-500">Battle Record:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {chal.wins}W - {chal.losses}L ({chal.winRate}% win-rate)
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-slate-500">Subject Specialty:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 truncate max-w-[130px]">
                        {chal.favoriteSubject}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartMatchmaking(chal)}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Challenge to 1v1 Battle</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Matchmaking Screen
  if (gameState === 'matchmaking') {
    return (
      <div className="rounded-3xl bg-slate-950 text-white border border-slate-800 p-12 text-center space-y-8 max-w-xl mx-auto my-8 shadow-2xl">
        <div className="flex items-center justify-center gap-8">
          <div className="space-y-2 text-center">
            <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white flex items-center justify-center text-4xl mx-auto shadow-lg shadow-indigo-500/30 animate-pulse">
              {studentBattleProfile.avatarEmoji}
            </div>
            <h4 className="text-sm font-bold">{studentBattleProfile.fullName}</h4>
            <span className="text-xs text-amber-400 font-semibold">{studentBattleProfile.eloRating} ELO</span>
          </div>

          <div className="text-3xl font-black text-rose-500 animate-bounce">
            VS
          </div>

          <div className="space-y-2 text-center">
            <div className="w-20 h-20 rounded-3xl bg-rose-600 text-white flex items-center justify-center text-4xl mx-auto shadow-lg shadow-rose-500/30 animate-pulse">
              {selectedChallenger?.avatarEmoji || '⚡'}
            </div>
            <h4 className="text-sm font-bold">{selectedChallenger?.name}</h4>
            <span className="text-xs text-amber-400 font-semibold">{selectedChallenger?.eloRating} ELO</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-black text-white flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" /> Entering Battle Arena...
          </h3>
          <p className="text-xs text-slate-400">
            5 High-Speed Concept Rounds • 15 Seconds Per Round • Speed Streak Bonuses
          </p>
        </div>

        <div className="w-48 h-1.5 rounded-full bg-slate-800 overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full animate-progress" />
        </div>
      </div>
    );
  }

  // 3. Battle Arena Gameplay Screen
  if (gameState === 'battle') {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 max-w-3xl mx-auto animate-in fade-in">
        {/* Split Opponents Header */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          {/* User Side */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-sm">
              {studentBattleProfile.avatarEmoji}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">You</span>
                {userStreak >= 2 && (
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    🔥 {userStreak}x
                  </span>
                )}
              </div>
              <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                {userScore} PTS
              </span>
            </div>
          </div>

          {/* Opponent Side */}
          <div className="flex items-center justify-end gap-3 text-right">
            <div>
              <div className="flex items-center justify-end gap-1.5">
                {opponentStreak >= 2 && (
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                    🔥 {opponentStreak}x
                  </span>
                )}
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {selectedChallenger?.name.split(' ')[0]}
                </span>
              </div>
              <span className="text-lg font-black text-rose-600 dark:text-rose-400">
                {opponentScore} PTS
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-2xl shadow-sm">
              {selectedChallenger?.avatarEmoji}
            </div>
          </div>
        </div>

        {/* Round Number & Timer Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Round {roundIdx + 1} of {totalRounds} • {currentQ.subject}
          </span>

          <div
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black transition-colors ${
              roundTimeLeft <= 4
                ? 'bg-rose-500 text-white animate-bounce'
                : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{roundTimeLeft}s</span>
          </div>
        </div>

        {/* Timer Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              roundTimeLeft <= 4
                ? 'bg-rose-500'
                : 'bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-600'
            }`}
            style={{ width: `${(roundTimeLeft / 15) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQ.questionText}
          </h3>
        </div>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((opt, idx) => {
            const isUserSelected = userSelectedOption === opt;
            const isOpponentSelected = opponentSelectedOption === opt;
            const isCorrect = opt === currentQ.correctAnswer;

            let btnStyle =
              'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:border-indigo-400 text-slate-900 dark:text-slate-200';

            if (roundEnded || userSelectedOption) {
              if (isCorrect) {
                btnStyle =
                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold';
              } else if (isUserSelected && !isCorrect) {
                btnStyle =
                  'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-bold';
              } else {
                btnStyle =
                  'border-slate-200 dark:border-slate-800 opacity-40 bg-slate-50 dark:bg-slate-850 text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleUserAnswer(opt)}
                disabled={Boolean(userSelectedOption) || roundEnded}
                className={`p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 transition-all ${btnStyle}`}
              >
                <span>{opt}</span>

                <div className="flex items-center gap-1">
                  {isUserSelected && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600 text-white font-bold">
                      You
                    </span>
                  )}
                  {isOpponentSelected && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold">
                      Rival
                    </span>
                  )}
                  {roundEnded && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Round Explanation Feedback */}
        {roundEnded && (
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-slate-700 dark:text-slate-300 space-y-1 animate-in fade-in">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-500" /> Explanation:
            </span>
            <p>{currentQ.explanation}</p>
          </div>
        )}
      </div>
    );
  }

  // 4. Results Screen
  const isVictory = userScore >= opponentScore;
  const isDraw = userScore === opponentScore;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center space-y-6 max-w-xl mx-auto animate-in fade-in">
      <div
        className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-xl ${
          isVictory
            ? 'bg-gradient-to-tr from-amber-400 to-amber-600 text-white shadow-amber-500/30'
            : 'bg-gradient-to-tr from-rose-500 to-slate-700 text-white shadow-rose-500/30'
        }`}
      >
        {isVictory ? <Trophy className="w-10 h-10" /> : <Shield className="w-10 h-10" />}
      </div>

      <div>
        <span
          className={`text-xs font-black uppercase tracking-wider ${
            isVictory ? 'text-amber-500' : 'text-rose-500'
          }`}
        >
          {isVictory ? 'VICTORY ACHIEVED! 🏆' : isDraw ? 'HONORABLE DRAW 🤝' : 'MATCH DEFEAT 🛡️'}
        </span>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
          {userScore} vs {opponentScore} PTS
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Battle against {selectedChallenger?.name} ({selectedChallenger?.university})
        </p>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Elo Rating</span>
          <span
            className={`text-base font-black mt-0.5 block ${
              isVictory ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {isVictory ? '+32 Rating' : '-14 Rating'}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">XP Earned</span>
          <span className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-0.5 block">
            +{isVictory ? '150' : '50'} XP
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={() => setGameState('lobby')}
          className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
        >
          Return to Arena Lobby
        </button>

        <button
          onClick={() => handleStartMatchmaking(selectedChallenger || undefined)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Rematch Challenger</span>
        </button>
      </div>
    </div>
  );
};
