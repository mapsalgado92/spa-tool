import useForm from "./hooks/useForm"
import { useReducer, useState } from "react"
import RCAFormBlock from "./RCAFormBlock"
import IDLink from "./IDLink"
import TextInput from "./TextInput"
import ToggleIput from "./ToggleInput"
import AreaInput from "./AreaInput"
import ReviewerList from "./ReviewerList"
import BoxGrid from "./BoxGrid"
import ReviewSelector from "./ReviewSelector"
import Uploader from "./components/files/Uploader"
import Downloader from "./components/files/Downloader"
import Papa from "papaparse"
import DataListInput from "./DataListInput"

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const [reviewsFile, setReviewsFile] = useState(null)
  const [rcaFile, setRcaFile] = useState(null)

  const form = useForm({ fields: form_fields })

  const uploadHandler = (file, type) => {
    if (type === "reviews") {
      Papa.parse(file, {
        complete: (results) => {
          let merged = results.data.map((row) => {
            let ticket_id = row.ticket_id
            let original = JSON.parse(row.original)
            let last_update = row.last_update ? JSON.parse(row.last_update) : {}
            return { ticket_id, ...original, ...last_update, updated: false }
          })
          console.log(merged)
          setReviewsFile(merged)
        },
        header: true,
        skipEmptyLines: true,
      })
    } else if (type === "rca") {
      Papa.parse(file, {
        complete: (results) => {
          let rca = {}
          results.data.forEach(
            (row) => (rca[row["level"]] = JSON.parse(row["json"]))
          )
          console.log(rca)
          setRcaFile(rca)
        },
        header: true,
        skipEmptyLines: true,
      })
    } else {
      console.log("Error, wrong type.")
    }
  }

  const removeUploadHandler = (type) => {
    switch (type) {
      case "reviews":
        setReviewsFile(null)
        break
      case "rca":
        setRcaFile(null)
        break
      default:
        break
    }
    dispatch({ type: "clear_pull" })
  }

  const filter_handler = (field, reviewer) => {
    if (field === "reviewer")
      dispatch({ type: "filter_reviewer", payload: { reviewer } })
    else if (field === "quality_reviewer")
      dispatch({ type: "filter_quality_reviewer", payload: { reviewer } })
    else if (field === "final_reviewer")
      dispatch({ type: "filter_final_reviewer", payload: { reviewer } })
    else if (field === "lm_agent_for_feedback") {
      dispatch({ type: "filter_line_manager", payload: { reviewer } })
    }
  }

  const select_handler = (ticket_id) => {
    let selection = state.updated.data.find((r) => r.ticket_id === ticket_id)
    form.resetAll()
    form.setMany(selection)
    dispatch({ type: "set_selected", payload: { selection } })
  }

  const save_handler = () => {
    dispatch({
      type: "save_form",
      payload: { form: form.getForm() },
    })
    alert(`Review Saved (Id: ${state.selected.ticket_id})`)
  }

  const pull_handler = async () => {
    dispatch({
      type: "pull",
      payload: { data: reviewsFile, rca: rcaFile },
    })
  }

  //----------------------------------------------------------> JSX

  return (
    <main>
      <div
        className="columns section px-5 pt-4 pb-2 m-0"
        style={{
          height: "100vh",
          overflowY: "hidden",
        }}
      >
        <div className="column is-3 is-flex is-flex-direction-column mb-0 card is-fullheight">
          <div className="control mb-2">
            <label className="label is-size-7 ">Reviews Upload</label>
            <Uploader
              loadedHandler={(file) => uploadHandler(file, "reviews")}
              removeHandler={() => removeUploadHandler("reviews")}
            />
          </div>
          <div className="control mb-2">
            <label className="label is-size-7">
              Root Cause Analysis Upload
            </label>
            <Uploader
              loadedHandler={(file) => uploadHandler(file, "rca")}
              removeHandler={() => removeUploadHandler("rca")}
            />
          </div>
          <div className="field">
            <div className="control is-expanded">
              <button
                className="button is-danger is-fullwidth is-light is-small mb-2"
                onClick={() => pull_handler()}
                disabled={state.pulled.is_pulled || !rcaFile || !reviewsFile}
              >
                PULL UPLOADED DATA
              </button>
            </div>
            <div className="control is-expanded">
              <Downloader
                records={
                  state.updated.is_updated &&
                  state.updated.data
                    .filter((r) => r.updated)
                    .map((r) => ({
                      ticket_id: r.ticket_id,
                      updated_date: new Date().toISOString(),
                      json: JSON.stringify(r),
                    }))
                }
                alert={download_alert_message}
                noHeaders={true}
                classes={"button is-success is-fullwidth is-light is-small"}
                disabled={!state.updated.is_updated}
              ></Downloader>
            </div>
          </div>

          {state.updated.data && (
            <div className="mb-2">
              <button
                className="button is-small is-fullwidth"
                onClick={() => dispatch({ type: "toggle_filters" })}
              >
                {state.filter.show ? "HIDE" : "SHOW"} FILTERS
              </button>
              <div hidden={!state.filter.show}>
                <ReviewerList
                  label={"Reviewer Selection"}
                  filter_handler={filter_handler}
                  field={"reviewer"}
                  data={state.updated.data}
                />

                <ReviewerList
                  label={"Final Reviewer Selection"}
                  filter_handler={filter_handler}
                  field={"final_reviewer"}
                  data={state.updated.data}
                />

                <ReviewerList
                  label={"Line Manager for Feedback Selection"}
                  filter_handler={filter_handler}
                  field={"lm_agent_for_feedback"}
                  data={state.updated.data}
                />
                <ReviewerList
                  label={"QC Reviewer Selection"}
                  filter_handler={filter_handler}
                  field={"quality_reviewer"}
                  data={state.updated.data}
                />
              </div>
            </div>
          )}
          {state.updated.data && (
            <>
              <div className="tag py-4 is-fullwidth is-dark is-radiusless">
                Reviews List
              </div>
              <div
                className="is-align-self-stretch"
                style={{ overflowY: "auto" }}
              >
                <ReviewSelector
                  data={state.updated.data}
                  filter={state.filter}
                  selected={state.selected}
                  select_handler={select_handler}
                />
              </div>
            </>
          )}
        </div>

        {state.selected && (
          <div
            className="column is-9 has-text-centered"
            style={{
              maxHeight: "100%",
              overflowY: "auto",
            }}
          >
            <IDLink
              link={state.selected.chat_link}
              label={state.selected.ticket_id}
            />
            <BoxGrid columns={top_columns} selected={state.selected} />

            <form name="form box">
              <div className="columns">
                <div className="column is-4">
                  <RCAFormBlock
                    form={form}
                    rca={state.rca}
                    label={"Main RCA"}
                    vertical={state.selected.cx_vertical}
                  />
                </div>
                <div className="column is-4">
                  <RCAFormBlock
                    form={form}
                    rca={state.rca}
                    label={"Secondary RCA"}
                    level="sec"
                    vertical={state.selected.cx_vertical}
                  />
                </div>
                <div className="column is-4">
                  <RCAFormBlock
                    form={form}
                    rca={state.rca}
                    label={"Tertiary RCA"}
                    level="ter"
                    vertical={state.selected.cx_vertical}
                  />
                </div>
              </div>
              <div className="columns is-centered">
                <div className="column is-4">
                  <TextInput
                    label={"Topic (when required)"}
                    form={form}
                    field={"topic"}
                    placeholder={"Uncategorised topic..."}
                  />
                </div>
                <div className="column is-4">
                  <DataListInput
                    label="Updated User Problem"
                    form={form}
                    field={"updated_user_problem"}
                    placeholder={"Searchable dropdown..."}
                    disabled={
                      state.selected.user_problem &&
                      state.selected.user_problem !== "Undefined user problem"
                    }
                    datalist={state.rca && state.rca.user_problems}
                  />
                </div>
              </div>

              <div className="columns">
                <div className="column is-4 box has-background-white-er">
                  <DataListInput
                    label={"Agent for Feedback"}
                    form={form}
                    field={"agent_for_feedback"}
                    placeholder={"example-agent@revolut.com"}
                    datalist={state.rca.agents && Object.keys(state.rca.agents)}
                  />
                  <DataListInput
                    label="LM for Feedback"
                    form={form}
                    field={"lm_agent_for_feedback"}
                    placeholder={"example-lm@revolut.com"}
                    disabled={form.get("agent_for_feedback") ? false : true}
                    datalist={
                      state.rca.agents && [
                        state.rca.agents[form.get("agent_for_feedback")],
                      ]
                    }
                  />
                  <AreaInput
                    label={"LM Feedback"}
                    form={form}
                    field={"lm_feedback"}
                    rows="4"
                  />
                  <br></br>
                  <div className="columns">
                    <div className="column is-half">
                      <ToggleIput
                        label={"Feedback Needed"}
                        form={form}
                        field={"feedback_needed"}
                        true_text={"YES"}
                        false_text={"NO"}
                        true_value={"TRUE"}
                        false_value={"FALSE"}
                      />
                    </div>
                    <div className="column is-half">
                      <ToggleIput
                        label={"Feedback Delivered"}
                        form={form}
                        field={"feedback_delivered"}
                        true_text={"YES"}
                        false_text={"NO"}
                        true_value={"TRUE"}
                        false_value={"FALSE"}
                      />
                    </div>
                  </div>
                </div>
                <div className="column is-4">
                  <AreaInput
                    label={"Reviewer Comment"}
                    form={form}
                    field={"reviewer_comment"}
                    rows="10"
                  />
                  <TextInput
                    label={"Final Reviewer"}
                    form={form}
                    field={"final_reviewer"}
                    placeholder={form.get("reviewer")}
                  />
                  <br></br>
                  <br></br>
                  <ToggleIput
                    label={"Review Status"}
                    form={form}
                    field={"is_reviewed"}
                    true_text={"Reviewed"}
                    false_text={"Not reviewed"}
                  />
                </div>
                <div className="column is-4">
                  <AreaInput
                    label={"Quality Check Comment"}
                    form={form}
                    field={"quality_check"}
                    rows="10"
                  />
                  <TextInput
                    label={"Final Quality Reviewer"}
                    form={form}
                    field={"final_quality_reviewer"}
                    placeholder={form.get("quality_reviewer")}
                  />
                  <br></br>
                  <br></br>
                  <ToggleIput
                    label={"Quality Check Status"}
                    form={form}
                    field={"is_quality_reviewed"}
                    true_text={"Reviewed"}
                    false_text={"Not reviewed"}
                  />
                </div>
              </div>
              <button
                className="button is-large is-success is-fullwidth is-size-6 my-4"
                onClick={() => save_handler()}
                type="button"
              >
                SAVE REVIEW
              </button>
              <BoxGrid columns={bottom_columns} selected={state.selected} />
              <footer>by SuperMario</footer>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}

//-----------------------------------------------------------> Reducer & Initial State
const reducer = (state, action) => {
  switch (action.type) {
    case "toggle_filters":
      return {
        ...state,
        filter: {
          ...state.filter,
          show: !state.filter.show,
        },
      }
    case "pull":
      return {
        ...state,
        pulled: {
          is_pulled: true,
          data: action.payload.data,
        },
        updated: {
          is_updated: false,
          data: structuredClone(action.payload.data),
        },
        selected: null,
        rca: structuredClone(action.payload.rca),
        filter: {
          show: false,
          reviewer: null,
          quality_reviewer: null,
        },
      }
    case "filter_reviewer":
      return {
        ...state,
        filter: {
          ...state.filter,
          reviewer:
            action.payload.reviewer === "All Reviewers"
              ? ""
              : action.payload.reviewer,
        },
      }
    case "filter_quality_reviewer":
      return {
        ...state,
        filter: {
          ...state.filter,
          quality_reviewer:
            action.payload.reviewer === "All Reviewers"
              ? ""
              : action.payload.reviewer,
        },
      }
    case "filter_final_reviewer":
      return {
        ...state,
        filter: {
          ...state.filter,
          final_reviewer:
            action.payload.reviewer === "All Reviewers"
              ? ""
              : action.payload.reviewer,
        },
      }
    case "filter_line_manager":
      return {
        ...state,
        filter: {
          ...state.filter,
          lm_agent_for_feedback:
            action.payload.reviewer === "All Reviewers"
              ? ""
              : action.payload.reviewer,
        },
      }
    case "set_selected":
      return { ...state, selected: action.payload.selection }
    case "save_form":
      let records = state.updated.data
      let index = records.findIndex(
        (r) => r.ticket_id === state.selected.ticket_id
      )
      records[index] = {
        ...state.selected,
        ...action.payload.form,
        updated: true,
      }

      return {
        ...state,
        updated: { ...state.updated, is_updated: true, data: records },
      }
    case "clear_pull":
      return { ...state, pulled: { is_pulled: false, data: null } }
    default:
      return state
  }
}

//---------------------------------------------------------- RCA Structure
const rca_template = {
  rca3: {
    "2nd Line/Fincrime Limitation": {
      "": [
        "ADD RCA3 on POM Comments",
        "SLA breach",
        "2nd line mistake",
        "Miscellaneous",
        "Late escalation",
        "Tech dependency",
      ],
      "Card Payments & ATM": [
        "Sherlock - declined",
        "Unsupported merchant",
        "Unsupported country/region",
      ],
      Chargeback: [
        "CHB outcome - rejected",
        "CHB pending review",
        "Push to Cards",
        "Dispute - Pending Payment",
        "Fraud Investigation",
      ],
      Referrals: ["Account not verified yet"],
      "Retail Account & Junior": [
        "Not able to terminate account from Anonymous state on behalf of the customer",
        "Not able to change Revolut entities without terminating account",
        "BlueSky User FC Limitations",
        "Phone number change issues & limitations",
        "Branch migration delay",
      ],
      "Retail Product": [
        "Rev Pro - Onboarding before Eligibility Confirmation",
        "Cashback Process Low Visibility",
        "Refund - Damaged Delivery",
        "Rev Pro - Offboarding lack of Reason",
        "Rev Pro - Risk Chat",
        "Screen Recording Denied",
        "Unclear T&Cs",
      ],
      Stays: [
        "Price complaint",
        "Pay at Property Charged Before Stay",
        "Cashback - Not Automatic",
        "Cashback - Pay at Property Payout Date",
        "Cashback - Other Platform",
        "Unable to Book - Sanctions",
        "Multiple Expedia Escalations",
      ],
      "Top-ups": [
        "Missing Money - Bank Statements Requested",
        "Missing Money Troubleshooter - Refund Given",
      ],
      Transfers: [
        "DD claim process",
        "SUS_ACT/FC flow/TM_ASSESS",
        "Transfer screening process",
        "Unsupported/locked beneficiary",
      ],
      "Wealth and Trading": [
        "Product Team dependency - Trading",
        "Product Team dependency - Crypto",
      ],
    },
    "Agent K-gap/Wrong Escalation": {
      "": [
        "Incorrect Escalation (Jira)",
        "Incorrect Escalation (Chat)",
        "Did not ask to go to app/web to upload documents",
        "Incorrect Snooze/Resolve",
        "Wrong TAT",
      ],
      "Card Payments & ATM": ["CPID Form - missing from BO", "Pending payment"],
      Chargeback: [
        "Compromised card flow",
        "Payment stop request",
        "Services not received",
        "Duplicate payment",
        "Push to cards",
        "Missing refund",
        "Offline payment",
      ],
      Insurance: ["Purchase protection"],
      "Retail Account & Junior": [
        "Agent does not understand paid plan benefits",
        "Legal queries",
        "Branches Migration",
        "Moving entities topic",
        "Free downgrades of paid plans",
        "Unable to explain balance to user",
        "Didn't follow internal policy (refund policy, downgrade, etc)",
      ],
      Transfers: [
        "Basic transfer details",
        "Escalation in",
        "Escalation out",
        "TBS - cancel/recall",
        "TBS - Early BACS",
        "TBS - missing IB",
        "TBS - missing OB",
      ],
      "Wealth and Trading": [
        "crypto withdrawal",
        "EEA migration",
        "GW not applied",
        "Incorrect rate charged",
        "L&E - awards not mentioned",
        "MMF temporarly not available in ES",
        "PnL",
        "Stock order issue",
        "Trading - Agent unable to explain portfolio",
        "Trading account offboarding troubleshooting",
        "Trading account onboarding troubleshooting",
        "Weekend fee",
        "Wrong calculation",
        "Trading - other",
        "FX - other",
        "Crypto - other",
      ],
    },
    Bug: {
      "": ["ADD BUG on POM Comments"],
      "Retail Product": [
        "MMF - Interest Displayed Incorrect",
        "Open Banking - Linking Account",
        "Group Vault - Balance",
        "Group Vault - Admin Block (Deposit)",
        "Notifications - Not Updating Correctly",
        "Savings - Vault Deposit",
        "Smart Delay - Pass Not Issued",
        "Subscription - Merchant Blocked",
        "Widget - Not Updating Correctly",
      ],
      Stays: ["Unable to Book", "Payment Unavailable", "Stays Not Visible"],
      "Top-ups": ["AVS Mismatch - Invalid Zipcode", "Incorrect Cashback"],
      "Wealth and Trading": [
        "Incorrect rate charged",
        "PnL",
        "Unable to buy stocks",
      ],
    },
    "Chat avoidance": {
      "": ["Chat Dropped/Escalated Without Reason"],
      "Card Payments & ATM": [
        "CPID Form - missing from BO",
        "Abusing Drop Policy",
        "Refund for Terminated Accounts",
      ],
      Chargeback: ["CHB outcome", "CHB timeframe"],
      "Retail Account & Junior": [
        "No PII data & GDPR excuse to not help customer",
      ],
    },
    "Lack of preinvestigation": {
      "": [
        "BO",
        "Chat Notes",
        "Confluence",
        "Jira",
        "No Bug Ticket Raised",
        "Previous chat history",
        "Same chat history",
        "Wrong information on documents",
        "No/incorrect troubleshooting done",
      ],
      "Wealth and Trading": [
        "Trading account funds withdrawal",
        "Weekend fee",
        "L&E Abuser",
      ],
    },
    "Lack of soft skills": {
      "": [
        "Lack of empathy",
        "Language skills",
        "Not deescalating",
        "Robotic approach / Atexts",
        "Style adjustment",
        "Tone of voice",
        "Wrong pitch",
        "Language skills",
        "Time to message",
        "Emojis",
      ],
    },
    "Mass Resolution": { "": ["ADD SOT ID"] },
    Outage: {
      "": [
        "ADD SOT ID",
        "App outage",
        "Chat/BO outage",
        "Product Outage",
        "Tech Outage",
      ],
      Stays: ["Expedia Outage", "Viator Outage"],
    },
    "Policy Limitation - Support (Horizontal)": {
      "": [
        "ADD RCA3 on POM Comments",
        "Drop Policy",
        "Resolve Policy",
        "Snooze Policy",
        "Split Chats Policy",
        "TAT Policy",
        "ADD TOPIC on POM Comments",
        "Duplicated chat",
        "Miscellaneous",
      ],
      "Card Payments & ATM": ["Missing from BO", "Reverted payment"],
      Chargeback: [
        "CHB outcome - rejected",
        "CHB pending review",
        "Cannot raise second CHB",
        "Goodwill not eligible",
        "Cannot raise CHB after 120 days",
      ],
      "Retail Account & Junior": [
        "Anonymous verification failed & chat ended",
        "Phone swap not possible due to strict authentication policy",
        "Fincrime dependency",
        "Manual verification",
        "Anonymous verification/User unresponsive",
        "Access recovery limitations",
        "Branches migration",
      ],
      "Top-ups": [
        "Failed Top-up - TM Declined",
        "Issuer Declined Top-up - 3DS challenge FAILED - Card authentication failed",
        "Issuer Declined Top-up - Suspected fraud",
        "Missing Money Troubleshooter - Failed iDeal Transaction",
        "Missing Money Troubleshooter - Reverted Topup",
      ],
      "Wealth and Trading": [
        "Agents cannot disclose credit criteria",
        "Tax advice question",
        "Crypto withdrawal failed - FinCrime",
      ],
    },
    "Process unclear - Confluence": {
      "": ["ADD TOPIC on POM Comments", "Confluence unclear", "Miscellaneous"],
      "Card Payments & ATM": [
        "Pending Payments",
        "CPID Form - missing from BO",
      ],
      Chargeback: ["Compromised card flow", "Excess charge dispute"],
      "Retail Account & Junior": [
        "Price plan & upgrades",
        "Branches migration transparency & explanations",
        "Blurry photo definition issue in customer identity verification",
        "Fix is provided by customer but not available on Confluence",
      ],
    },
    "Product limitation": {
      "": [
        "ADD PRODUCT LIMITATION on POM Comments",
        "Language barrier",
        "Chat History - Delete",
      ],
      "Card Payments & ATM": [
        "Payment Declined",
        "Pending Payments",
        "Blocked Subscription",
        "ATM fee",
      ],
      Chargeback: [
        "CHB auto rejected on BO",
        "Pending payment",
        "Merchant pending refund",
      ],
      Insurance: [
        "Claims - Form Issue",
        "Claims - Not handled by Revolut",
        "Claims - Not covered / Declined Claim",
        "Product not offered - Device Insurance",
        "Travel Insurance - Limited to 90 day Coverage",
      ],
      Referrals: [
        "Card payment pending",
        "Variable Rewards",
        "Invitee had a previous account",
        "No reward for Invitees",
        "Abusive User",
        "Link not used",
        "Card payment missing",
        "Invitee not recorded",
        "Regular campaign",
        "Invitee with Terminated account",
        "Referrers currency different from Invitee",
        "Physical Card not ordered",
        "Card delivery delayed",
      ],
      "Retail Account & Junior": [
        "Free trial eligibility, auto-renewal & card cancellation",
        "BlueSky Account Type Plan Limitations",
        "Requested documents can't be provided by Revolut",
        "Card specific statements can'tbe provided by Revolut",
        "Price plan change",
        "JA limitations",
        "Region limitations",
        "Price plan features limitations",
        "Official bank statement not available on BackOffice nor App",
        "AI does not recognise Selfie for AR properly",
        "Branch migration - IBAN limitations",
        "RA process/product related BUG",
        "Downgrade refunds & limitations",
      ],
      "Retail Product": [
        "Savings - Non Daily Interest",
        "Rewards - Availability",
        "Revolut Pro - Settlement Time",
        "Savings - Eligibility",
        "Smart Delay - 2h Registration",
        "Smart Delay - Full Lounge",
        "Transactions - Delete",
        "Account Statement",
        "App - Availability",
        "App - Non Functioning",
        "App Feature Removal Unavailable",
        "Blurry Balance - Turn Off",
        "MMF - Interest Rate",
        "Plan Cashback - Low",
        "Savings - Offboarding",
        "Smart Delay - No Lounge",
        "Rev Pro - Business nature not accepted",
      ],
      Stays: [
        "Invoice Request",
        "Refund Booking",
        "Alter Booking",
        "Cancel Booking",
        "Multiple Room Booking",
        "Missing Feature",
        "Hotel Complaint",
      ],
      "Top-ups": [
        "Failed Top-up - insufficient funds",
        "3DS Decline - 3DS challenge FAILED - Server timeout on bank side",
        "Cash Deposit Availability",
        "Issuer Decline - Do not honor",
        "Card Declined - TM Declined",
        "Timeframe to revert fund",
        "Issuer Decline - Transaction cannot be completed - violation of law",
        "Mobile Check Deposits Availability",
        "3DS Decline - 3DS challenge DECLINED - Suspected fraud activity",
        "3DS Decline - 3DS challenge FAILED - Card authentication failed",
        "App UI - Rolling Balance Clarity",
        "Apple Pay - Deposit Limits",
        "Auto Top-up Eligibility - New Added Card",
        "Failed iDeal - COMPLIANCE_SCREENING",
        "Failed iDeal - Daily Limit Exceeded",
        "Failed iDeal - Name Mismatch",
        "Failed Top-up - External Card Eligibility",
        "ideal Topup Reverted - COMPLIANCE_SCREENING",
        "Issuer Decline - Invalid CVV",
        "Issuer Decline - Issuing bank system down for maintenance",
        "Issuer Decline - Payment attempt blocked - Stolen card, pick up (fraud account)",
        "Issuer Decline - Security violation",
        "Mobile Check Deposit - Rejected",
        "Payment Link Fail - Daily Limit Exceeded",
        "Requested Document Not Available",
        "Top Up Successful - User Unhappy with Timeframes",
        "Topup Fees - Card Category",
      ],
      Transfers: [
        "Bounceback/refund/recall timeframe",
        "Impossible to cancel/recall",
        "Missing IB transfer, out of control",
        "Missing OB, out of control",
        "Missing transfer out, within timeframe",
        "Transfer took longer than usual",
      ],
      "Wealth and Trading": [
        "Crypto fees",
        "Crypto staking time",
        "Crypto withdrawal - pending",
        "Crypto withdrawal - failed",
        "Crypto withdrawals - not available in FR",
        "EEA migration offboarding",
        "Exchange rate fluctuations",
        "L&E Abuser",
        "L&E discontinued in the UK",
        "L&E pending",
        "L&E reward change",
        "MMF temporarly not available in ES",
        "No possibility to reverse transaction",
        "Not supported currency",
        "Portfolio transfer unavailable RSEUAB",
        "Spousal consent",
        "Stock liquidation",
        "Trading account onboarding - other",
        "Trading account onboarding - TIN",
        "Trading account onboarding - long time",
        "Trading limits",
        "FX weekend fee",
      ],
    },
    "Query recognition": {
      "": ["ADD TOPIC", "Other vertical", "Address all questions"],
      "Card Payments & ATM": [
        "CPID Form - missing from BO",
        "Pending Payments",
        "Declined Payment Reason",
      ],
      Chargeback: [
        "Compromised card flow",
        "Missing refund",
        "Payment stop request",
        "Services not received",
        "Duplicate payment",
      ],
      "Retail Account & Junior": ["Retail Account VS Cards"],
    },
  },
  rca2: {
    Process: [
      "Policy Limitation - Support (Horizontal)",
      "2nd Line/Fincrime Limitation",
      "Process unclear",
    ],
    People: [
      "Agent K-gap/Wrong Escalation",
      "Lack of soft skills",
      "Lack of preinvestigation",
      "Query recognition",
      "Chat avoidance (Ping ponging)",
    ],
    Product: ["Bug", "Outage", "Product limitation", "Mass Resolution"],
    "Quantitative Data Point (check if flagged in red)": [
      "Mass Message (Yes/No)",
      "Number of agents",
      "FQT",
      "CRT",
      "Routing Accuracy (Yes/No)",
      "Number of interactions",
    ],
    "No Issue Found": [
      "User Unresponsive",
      "Chat properly handled and resolved",
    ],
  },
  rca1: [
    "Process",
    "People",
    "Product",
    "Quantitative Data Point (check if flagged in red)",
    "No Issue Found",
  ],
}

const initialState = {
  pulled: {
    is_pulled: false,
    data: null,
  },
  updated: {
    has_changed: false,
    data: null,
  },
  selected: null,
  rca: rca_template,
  filter: {
    show: true,
    reviewer: null,
    quality_reviewer: null,
    final_reviewer: null,
    lm_agent_for_feedback: null,
  },
}

//----------------------------------------------------------- Form Fields
const form_fields = [
  {
    name: "rca1",
    label: "RCA 1",
    default: "",
    required: true,
  },
  {
    name: "rca2",
    label: "RCA 2",
    default: "",
    required: true,
  },
  {
    name: "rca3",
    label: "RCA 3",
    default: "",
    required: true,
  },
  {
    name: "rca1",
    label: "RCA 1",
    default: "",
    required: true,
  },
  {
    name: "rca2",
    label: "RCA 2",
    default: "",
    required: true,
  },
  {
    name: "rca3",
    label: "RCA 3",
    default: "",
    required: true,
  },
  {
    name: "sec_rca1",
    label: "Secondary RCA 1",
    default: "",
    required: true,
  },
  {
    name: "sec_rca2",
    label: "Secondary RCA 2",
    default: "",
    required: true,
  },
  {
    name: "sec_rca3",
    label: "Secondary RCA 3",
    default: "",
    required: true,
  },
  {
    name: "ter_rca1",
    label: "Tertiary RCA 1",
    default: "",
    required: true,
  },
  {
    name: "ter_rca2",
    label: "Tertiary RCA 2",
    default: "",
    required: true,
  },
  {
    name: "ter_rca3",
    label: "Tertiary RCA 3",
    default: "",
    required: true,
  },
  {
    name: "topic",
    label: "Topic",
    default: "",
    required: false,
  },
  {
    name: "feedback_needed",
    label: "Feedback Needed",
    default: "",
    required: false,
    type: "string",
  },
  {
    name: "feedback_delivered",
    label: "Feedback Delivered",
    default: "",
    required: false,
    type: "string",
  },
  {
    name: "agent_for_feedback",
    label: "Agent for Feedback",
    default: "",
    required: false,
    type: "email",
  },
  {
    name: "lm_agent_for_feedback",
    label: "Line Manager (Agent for Feedback)",
    default: "",
    required: false,
    type: "email",
  },
  { name: "lm_feedback", default: "", required: false },
  {
    name: "reviewer_comment",
    label: "Reviewer Comment",
    default: "",
    required: false,
    type: "textarea",
  },
  {
    name: "quality_check_comment",
    label: "Quality Check Comment",
    default: "",
    required: false,
    type: "textarea",
  },
  {
    name: "is_reviewed",
    label: "Is Reviewed?",
    default: "Not Reviewed",
    required: false,
  },
  {
    name: "is_quality_reviewed",
    label: "Is Quality Reviewed?",
    default: "Not Reviewed",
    required: false,
  },
  {
    name: "updated",
    label: "Was updated on this session?",
    default: false,
    required: true,
  },
  { name: "final_reviewer", default: "", required: false },
  { name: "final_quality_reviewer", default: "", required: false },
  { name: "updated_user_problem", default: "", required: false },
]

//---------------------------------------------------------- Selected Columns
const bottom_columns = [
  { name: "ticket_id", label: "Ticket ID" },
  { name: "last_assigned_agent_email", label: "Agent" },
  { name: "fqt_minutes", label: "FQT (Minutes)" },
  { name: "crt", label: "CRT" },
  { name: "is_first_contact_resolution", label: "FCR" },
  { name: "has_mass_message", label: "Has Mass Message" },
  { name: "number_of_interactions", label: "Number of Interactions" },
  { name: "agent_count_distinct", label: "Agent Count" },
  { name: "last_assigned_agent_lm_id", label: "Last Assigned LM ID" },
  { name: "is_accurately_routed", label: "Is Accurately Routed" },
  { name: "queue_name", label: "Queue Name" },
  { name: "reviewer", label: "Reviewer" },
  { name: "quality_reviewer", label: "Quality Reviewer" },
  { name: "last_specialised_queue", label: "Last Specialised Queue" },
  { name: "feedback", label: "Feedback" },
]

const top_columns = [
  { name: "rated_date", label: "Rated Date" },
  { name: "cx_vertical", label: "Allocation Vertical" },
  { name: "user_problem", label: "User Problem" },
  { name: "last_assigned_agent_agency", label: "Agency" },
]

const download_alert_message =
  "Updates downloaded.\nTo persist your changes import the 'updates' CSV into your Google Sheets source file.\nMake sure to select the APPEND method and TAB as delimiter."
