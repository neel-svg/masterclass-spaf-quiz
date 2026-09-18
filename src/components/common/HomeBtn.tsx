interface HomeBtnProps {
  onClick: () => void;
}

export function HomeBtn({ onClick }: HomeBtnProps) {
  return (
    <button className="home-btn" onClick={onClick} title="Back to Home">
      🏠
    </button>
  );
}
