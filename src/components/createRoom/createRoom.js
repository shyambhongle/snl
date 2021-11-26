import React, { useState, useEffect } from "react";
import styles from "./createRoom.module.css";

const CreateRoom = (props) => {
  const { startGame, socket, myId } = props;
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomDetails, setRoomDetails] = useState({});

  useEffect(() => {
    socket.on("room-update", ({ type, payload }) => {
      console.log("room-update", payload);
      setRoomDetails({ ...payload });
      console.log("payload length inside", payload.players.length);

      if (payload.players && payload.players.length === 2) {
        console.log(" inside", payload);

        setTimeout(() => {
          console.log("timeout trigerd", payload);
          startGame(payload);
        }, 3000);
      }
    });
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const hasRoom = urlParams.get("roomId");
    if (hasRoom) {
      setRoomId(hasRoom);
    }
    return () => {
      socket.off("room-update");
    };
  }, []);

  const createNewRoom = () => {
    if (name) {
      socket.emit("join-room", {
        playerType: "master",
        name: name,
        myId: myId,
      });
    } else {
      window.alert("Please enter name");
    }
  };

  const joinRoom = () => {
    if (name && roomId) {
      socket.emit("join-room", {
        playerType: "player",
        joinRoom: roomId,
        name: name,
        myId: myId,
      });
    } else {
      window.alert("Please enter name & room id");
    }
  };

  return (
    <div className={styles.container}>
      {!roomDetails.roomId ? (
        <div className={styles.gameMode}>
          <div className={styles.formContainer}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              onChange={(evt) => setName(evt.target.value)}
              value={name}
            />
            <span className={styles.modeTitle}>Create New Room</span>

            <button onClick={createNewRoom}> Create Room</button>
            <span>Or</span>
            <span className={styles.modeTitle}>Join Room</span>

            <label>Room Id</label>
            <input
              type="text"
              name="roomId"
              value={roomId}
              onChange={(evt) => setRoomId(evt.target.value)}
            />
            <button onClick={joinRoom}>Join Room</button>
          </div>
        </div>
      ) : (
        <>
          <span className={styles.headerNote}>Game Room</span>
          <div className={styles.playerDetails}>
            <div className={styles.singlePlayers}>
              <div className={styles.profile}></div>
              <div className={styles.name}>{roomDetails.players[0].name}</div>
            </div>
            <span className={styles.vsText}>Vs</span>
            <div className={styles.singlePlayers}>
              {roomDetails.players[1] ? (
                <>
                  <div className={styles.profile}></div>
                  <div className={styles.name}>
                    {roomDetails.players[1].name}
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.addPlayer}></div>
                  <div className={styles.name}>?</div>
                </>
              )}
            </div>
          </div>
          {roomDetails.players[1] ? (
            <span className={styles.gameNote}>Game Starts in 3s</span>
          ) : (
            <span className={styles.infoNote}>
              Share the link to other player.
              <br />
              <span>{`http://localhost:3000/${roomDetails.roomId}`}</span>
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default CreateRoom;
