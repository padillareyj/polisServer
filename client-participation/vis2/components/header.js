import React from "react";
import _ from "lodash";
import Gear from "./gear";

class Header extends React.Component {
  render() {
    return (
      <div style={{
        maxWidth: 768,
        padding: "20px 10px 0px 10px",
        margin: "auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        {this.props.is_embedded ? "" :<img src="https://care.or.th/wp-content/care-polis.png" width="150" alt="CARE" /> }
        {this.props.is_owner ? <Gear conversation_id={this.props.conversation_id}/> : ""}
      </div>
    )
  }
}

export default Header;
