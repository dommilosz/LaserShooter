import React, { useContext, useEffect, useRef } from "react";
import { ShotData } from "../types";
import moment from "moment";
import { sessionContext } from "../App";
import { selectedShotContext } from "../views/HomeView";
import { resolveClientUserName } from "../api/resolveClientUser";
import { useLocation } from "react-router-dom";
import {deleteShot} from "../api/backendApi";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import ObjectContainer, {ObjectCard} from "./ObjectContainer";
import {useShowConfirmBox} from "./DialogBoxComponents/MessageBoxContext";

moment.updateLocale("en", {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: function (number, withoutSuffix, key, isFuture) {
            return number + "s";
        },
        m: "1m",
        mm: function (number, withoutSuffix, key, isFuture) {
            return number + "m";
        },
        h: "1h",
        hh: "%dh",
        d: "1d",
        dd: "%dd",
        M: "1mo",
        MM: "%dmo",
        y: "1y",
        yy: "%dy",
    },
});

export default function recentShots({ selectedShot, setSelectedShot }: any) {
    let { sessionData } = useContext(sessionContext);
    return (
        <selectedShotContext.Provider value={[selectedShot, setSelectedShot]}>
            <ObjectContainer empty={sessionData.shots.length <= 0}>
                {sessionData.shots
                    .map((shot, i) => {
                        return (
                            <ShotObject
                                shot={shot}
                                key={i}
                                index={sessionData.shots.length - i - 1}
                            ></ShotObject>
                        );
                    })
                    .reverse()}
            </ObjectContainer>
        </selectedShotContext.Provider>
    );
}

export function ShotObject({ shot, index }: { shot: ShotData; index: number }) {
    const [selectedShot, setSelectedShot] = useContext(selectedShotContext);
    let { sessionData, users } = useContext(sessionContext);
    let shotUsername = resolveClientUserName(
        sessionData,
        shot.idPacket.clientId,
        users,
        shot.ts
    );

    let timeAgo = moment(shot.ts).fromNow(true);
    let objRef = useRef<HTMLDivElement>(null);
    let location = useLocation();

    useEffect(() => {
        if (
            location.state?.selectShot &&
            location.state?.selectShot.idPacket.shotId ===
                shot.idPacket.shotId &&
            objRef.current !== null
        ) {
            objRef.current!.scrollIntoView({ behavior: "smooth" });
        }
    }, [location.state?.selectShot]);

    let showConfirmBox = useShowConfirmBox();

    return (
        <ObjectCard
            active={selectedShot == index}
            className={`object-card shots`}
            onClick={() => {
                if (setSelectedShot) setSelectedShot(index);
            }}
        >
            <Box
                ref={objRef}
                sx={{
                    p: "8%",
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Stack spacing={0.5}>
                    <Typography fontWeight={900}>
                        Score: {shot.score}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Player:{" "}
                        {shotUsername == undefined ? "None" : shotUsername}
                    </Typography>
                </Stack>
                <div style={{ width: "20%" }}>
                    <Typography color="text.secondary">
                        {timeAgo} ago
                    </Typography>
                    <IconButton
                        onClick={async () => {
                            if (
                                !await showConfirmBox(
                                    {content:`Remove ${shot.idPacket.shotId} shot?`,title:"Remove shot"}
                                )
                            ) {
                                return;
                            }
                            let resp = await deleteShot(shot.idPacket.shotId);
                            if (resp.status !== 200) {
                                alert(await resp.text());
                            }
                        }}
                    >
                        <DeleteIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </div>
            </Box>
        </ObjectCard>
    );
}
