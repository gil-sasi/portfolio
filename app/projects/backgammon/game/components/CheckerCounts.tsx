import React from "react";
import { useTranslation } from "react-i18next";
import { BackgammonGameState } from "../types";
import { getCheckerSummary } from "../utils/checkerUtils";

interface CheckerCountsProps {
  gameState: BackgammonGameState;
  playerIndex: number | null;
}

const CheckerCounts: React.FC<CheckerCountsProps> = ({
  gameState,
  playerIndex,
}) => {
  const { t } = useTranslation();

  const whiteCheckers = getCheckerSummary(gameState, 0);
  const blackCheckers = getCheckerSummary(gameState, 1);

  return (
    <div className="glass rounded-xl p-4 mb-4">
      <h3 className="text-lg font-semibold text-amber-100 mb-3 text-center">
        {t("backgammon.checkersOnBoard")}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* White Player Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-amber-200">
              {t("backgammon.whitePlayer")}
            </span>
            {playerIndex === 0 && (
              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                {t("backgammon.youArePlayer")} 0
              </span>
            )}
          </div>

          <div className="bg-amber-900/20 rounded-lg p-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-amber-200">
                {t("backgammon.checkersOnBoard")}:
              </span>
              <span className="text-amber-100 font-medium">
                {whiteCheckers.onBoard}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-amber-200">
                {t("backgammon.checkersAtHome")}:
              </span>
              <span className="text-amber-100 font-medium">
                {whiteCheckers.atHome}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-amber-200">
                {t("backgammon.checkersBornOff")}:
              </span>
              <span className="text-amber-100 font-medium">
                {whiteCheckers.bornOff}
              </span>
            </div>
          </div>
        </div>

        {/* Black Player Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-200">
              {t("backgammon.blackPlayer")}
            </span>
            {playerIndex === 1 && (
              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                {t("backgammon.youArePlayer")} 1
              </span>
            )}
          </div>

          <div className="bg-gray-700/20 rounded-lg p-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-200">
                {t("backgammon.checkersOnBoard")}:
              </span>
              <span className="text-gray-100 font-medium">
                {blackCheckers.onBoard}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-200">
                {t("backgammon.checkersAtHome")}:
              </span>
              <span className="text-gray-100 font-medium">
                {blackCheckers.atHome}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-200">
                {t("backgammon.checkersBornOff")}:
              </span>
              <span className="text-gray-100 font-medium">
                {blackCheckers.bornOff}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckerCounts;
