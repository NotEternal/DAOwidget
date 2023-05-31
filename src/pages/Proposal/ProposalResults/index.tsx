import { ProposalType } from "src/hooks/useProposals";
import { ResultData } from "src/hooks/useVotes";

type ProposalResultsProps = {
  choices: ProposalType["choices"];
  results: ResultData;
  strategies: ProposalType["strategies"];
};

function ProposalResults(props: ProposalResultsProps) {
  const { choices, results, strategies } = props;

  const tokenSymbol = strategies[0].params.symbol;

  return (
    <div className="proposalSection">
      <h3 className="proposalSectionTitle">Results</h3>
      <div className="proposalSectionItemsWrapper votesProgressWrapper">
        {choices.map((choice, i) => {
          const resultByVoteBalance = results.resultsByVoteBalance[i];
          const persentsOfChoice =
            (resultByVoteBalance / results.sumOfResultsBalance) * 100;

          return (
            <div className="proposalSectionProgressBar" key={i}>
              {`${choice} - ${resultByVoteBalance.toFixed(
                4
              )} ${tokenSymbol} (${persentsOfChoice.toFixed(2)} %)`}
              <progress
                max="100"
                value={persentsOfChoice}
                style={{ width: "100%" }}
              ></progress>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProposalResults;
