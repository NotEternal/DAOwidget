import { useState } from "react";
import VotingModalButton from "src/components/Modal/Modals/Voting/index.";
import { ProposalType } from "src/hooks/useProposals";
import ChoiceButton from "./ChoiceButton";

type ProposalVotesType = {
  proposal: ProposalType;
};

function ProposalVoting(props: ProposalVotesType) {
  const { proposal } = props;

  const { choices } = proposal;

  const [checkedChoice, setCheckedChoice] = useState(-1);

  return (
    <>
      <div className="proposalSection">
        <h3 className="proposalSectionTitle">Cast your vote</h3>
        <div className="">
          <div className="mb-1">
            {choices.map((choice, i) => {
              return (
                <ChoiceButton
                  key={i}
                  id={`choice-${i}`}
                  text={choice}
                  isActive={checkedChoice === i}
                  onClick={() => {
                    setCheckedChoice(i);
                  }}
                />
              );
            })}
          </div>
          <VotingModalButton
            checkedChoice={checkedChoice}
            proposal={proposal}
          />
        </div>
      </div>
    </>
  );
}

export default ProposalVoting;
