import type { RoomState } from '../types/RoomState';

export default function PlayersGrid({
  room, shouldFlipCards,
}: {
  room: RoomState;
  shouldFlipCards: boolean;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Object.entries(room.players || {}).map(([id, p]) => {
        const voted = id in (room.votes || {});
        const val = room.votes?.[id];
        return (
          <div key={id}
               className={`aspect-[3/4] rounded-2xl border-2 transition-all duration-700 ${
                 voted ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'
               } ${shouldFlipCards ? 'bg-blue-50 border-blue-300' : ''}`}
               style={{ transform: shouldFlipCards ? 'rotateY(180deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d' }}>
            <div className="h-full flex flex-col items-center justify-center p-4"
                 style={{ transform: shouldFlipCards ? 'rotateY(180deg)' : 'rotateY(0deg)', backfaceVisibility: 'hidden' }}>
              <div className="text-sm font-medium text-center mb-2">{p.name}</div>
              {voted ? (
                <div className={`text-2xl font-bold ${shouldFlipCards ? 'text-blue-600' : 'text-green-600'}`}>
                  {shouldFlipCards ? (val ?? '?') : '✓'}
                </div>
              ) : (
                <div className="text-sm text-gray-500">Waiting...</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
