export default function MoodOrb({
  score = 0,
  size = 180,
  label = "Today",
}) {

  const radius =
    (size - 20) / 2;

  const circumference =
    2 * Math.PI * radius;

  const safeScore =
    Math.max(
      0,
      Math.min(
        100,
        Number(score) || 0
      )
    );

  const offset =
    circumference -
    (safeScore / 100) *
      circumference;

  const center =
    size / 2;


  return (

    <div
      className="relative flex flex-col items-center justify-center"
      style={{
        width: size,
        height: size,
      }}
    >

      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >

        <defs>

          <linearGradient
            id="orbGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >

            <stop
              offset="0%"
              stopColor="var(--color-dawn-400)"
            />

            <stop
              offset="100%"
              stopColor="var(--color-dusk-600)"
            />

          </linearGradient>

        </defs>


        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--color-dusk-100)"
          strokeWidth="10"
        />


        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#orbGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />

      </svg>


      <div className="absolute flex flex-col items-center">

        <span className="font-display text-4xl text-dusk-900">

          {safeScore}

        </span>


        <span className="text-xs uppercase tracking-wider text-dusk-400 mt-1">

          {label}

        </span>

      </div>

    </div>

  );

}