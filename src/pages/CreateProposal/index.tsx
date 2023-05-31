import { useState } from "react";
import CreateProposalActions from "./CreateProposalActions";
import CreateProposalBodyTextArea from "./CreateProposalBodyTextArea";
import { ReactComponent as LeftArrow } from "src/assets/svg/left-arrow.svg";

import "./index.scss";

function CreateProposal() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <section className="app-page createProposal mb-2">
      <div className="createProposalHeader">
        <a href="#/" className='allProposalsLink'>
          <LeftArrow fill="var(--color-text-primary)" />
        </a>
        <h2>Create Proposal</h2>
      </div>

      <input
        maxLength={128}
        className="createTitleInput"
        placeholder="Title (proposal in one sentence)"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <CreateProposalBodyTextArea
        className="createBodyTextArea mb-1"
        placeholder="Tell more about your proposal (optional)"
        onSetValue={(e) => setBody(e.target.value)}
        value={body}
      />
      <CreateProposalActions title={title} body={body} />
    </section>
  );
}

export default CreateProposal;
