const Progress = ({ label, value }) => (
    <div>
        <label>{label}</label>
        <progress value={value} max="100"></progress>
    </div>
);

export default Progress;
