import { Card } from "./Tags";

const ExerciseHistory = ({exerciseHistory, workoutInfo, exerciseName, isCardio}) => {
  return (
    <>
    <Card className="bg-side-900">
        <h4>{workoutInfo.name}</h4>
        <div className="table-container mx-auto">
            <p className="font-bold">{exerciseName}</p>
            <p>{exerciseHistory.notes}</p>
            <div className="table-row">
                <div className="table-cell">SET</div>
                {!isCardio && <div className="table-cell">WEIGHT & REPS</div>}
                {isCardio && <div className="table-cell">TIME & DISTANCE</div>}
            </div>
            {
                exerciseHistory && isCardio ? (
                    exerciseHistory.time.map((_, index) => {
                        return (
                            <div key={`${exerciseHistory.id}-${index}`} className="table-row">
                                <div className="table-cell">{index + 1}</div>
                                <div className="table-cell">{`${exerciseHistory.distance[index]} miles in ${exerciseHistory.time[index]} minutes`}</div>
                            </div>
                        )

                    })
                ) : (
                    exerciseHistory.reps.map((_, index) => {
                        return (
                            <div key={`${exerciseHistory.id}-${index}`} className="table-row">
                                <div className="table-cell">{index + 1}</div>
                                <div className="table-cell">{`${exerciseHistory.weight[index]}lbs x ${exerciseHistory.reps[index]} reps @ ${exerciseHistory.rpe[index]} rpe`}</div>
                            </div>
                        )
                    })
                )
            }
        </div>
    </Card>
    </>
  )
}

export default ExerciseHistory