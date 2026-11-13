import { Layer } from './SceneFrame';

// Временная сцена для городов без своей: горы, холмы, кварталы, вода, листва.
// Те же классы цветов, что у настоящих сцен, — палитра времени суток работает сразу.
const BLOCKS = [
  [180, 520, 70, 170],
  [260, 560, 90, 130],
  [360, 500, 60, 190],
  [430, 540, 110, 150],
  [560, 470, 70, 220],
  [640, 530, 90, 160],
  [740, 500, 60, 190],
  [810, 550, 120, 140],
  [940, 480, 80, 210],
  [1030, 540, 100, 150],
  [1140, 510, 70, 180],
  [1220, 560, 110, 130],
];

export function GenericScene() {
  return (
    <>
      <Layer depth={8}>
        <path
          className="f-far"
          d="M-60 470 L60 410 L150 440 L250 360 L340 420 L470 330 L590 420 L700 360 L820 430 L950 340 L1070 410 L1180 350 L1300 420 L1500 360 L1500 780 L-60 780Z"
        />
        <path className="f-snow" d="M224 386 L250 360 L276 386 L260 380 L250 388 L238 380Z" />
        <path className="f-snow" d="M446 352 L470 330 L494 352 L480 346 L470 354 L458 346Z" />
        <path className="f-snow" d="M928 360 L950 340 L972 360 L958 355 L950 362 L940 355Z" />
      </Layer>
      <Layer depth={18}>
        <path
          className="f-mid"
          d="M-60 600 C120 500 300 440 520 470 C640 488 720 540 800 620 L800 780 L-60 780Z"
        />
        <path
          className="f-mid2"
          d="M640 640 C820 520 1040 470 1240 500 C1360 518 1440 560 1500 600 L1500 780 L640 780Z"
        />
      </Layer>
      <Layer depth={30}>
        {BLOCKS.map(([x, y, w, h], i) => (
          <g key={x}>
            <rect className={i % 2 ? 'f-city2' : 'f-city'} x={x} y={y} width={w} height={h} />
            <path
              className="f-roof"
              d={`M${x - 6} ${y} L${x + w / 2} ${y - 22} L${x + w + 6} ${y}Z`}
            />
            {[0, 1, 2].map((r) =>
              [0, 1].map((c) => (
                <g key={`${r}-${c}`}>
                  <rect
                    className="f-win-base"
                    x={x + 12 + c * (w / 2 - 6)}
                    y={y + 20 + r * 34}
                    width="12"
                    height="16"
                  />
                  <rect
                    className="f-win"
                    x={x + 12 + c * (w / 2 - 6)}
                    y={y + 20 + r * 34}
                    width="12"
                    height="16"
                  />
                </g>
              )),
            )}
          </g>
        ))}
        <rect className="f-water" x="-60" y="688" width="1560" height="100" />
      </Layer>
      <Layer depth={56}>
        <path className="f-near" d="M-60 780 C40 700 120 690 200 720 C260 650 340 660 380 780Z" />
        <path
          className="f-near"
          d="M1180 780 C1240 680 1330 670 1380 720 C1430 690 1480 700 1520 780Z"
        />
      </Layer>
    </>
  );
}
