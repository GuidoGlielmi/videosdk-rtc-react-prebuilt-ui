import { Box, Tooltip, Typography } from "@material-ui/core";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import React, { useMemo, useState } from "react";
import AnswerSubmittedIcon from "../../icons/AnswerSubmittedIcon";
import CorrectSelectedIcon from "../../icons/CorrectSelectedIcon";
import NoPollActiveIcon from "../../icons/NoPollActiveIcon";
import WrongOptionSelectedIcon from "../../icons/WrongOptionSelectedIcon";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import useResponsiveSize from "../../utils/useResponsiveSize";
import { MarkCorrectCheckbox } from "./CreatePoll";
import { secondsToMinutes, usePollStateFromTimer } from "./PollList";

const SubmitPollListItem = ({ poll, panelHeight, index, totalPolls }) => {
  const padding = useResponsiveSize({
    xl: 12,
    lg: 10,
    md: 8,
    sm: 6,
    xs: 4,
  });
  const marginY = useResponsiveSize({
    xl: 14,
    lg: 12,
    md: 10,
    sm: 8,
    xs: 6,
  });

  const mMeeting = useMeeting();

  const localParticipantId = useMemo(
    () => mMeeting?.localParticipant?.id,
    [mMeeting]
  );

  const { publish } = usePubSub(`SUBMIT_A_POLL_${poll.id}`);

  const { hasCorrectAnswer, hasTimer, timeout, createdAt, isActive } = poll;

  const { isActive: isTimerPollActive, timeLeft } = usePollStateFromTimer({
    timeout,
    createdAt,
    enabled: hasTimer,
  });

  const isPollActive = useMemo(
    () => (hasTimer ? isTimerPollActive : isActive),
    [hasTimer, isTimerPollActive, isActive]
  );

  const {
    localSubmittedOption,
    totalSubmissions,
    groupedSubmissionCount,
    maxSubmittedOptions,
  } = useMemo(() => {
    const localSubmittedOption = poll.submissions.find(
      ({ participantId }) => participantId === localParticipantId
    );

    const totalSubmissions = poll.submissions.length;

    const groupedSubmissionCount = poll.submissions.reduce(
      (group, { optionId }) => {
        group[optionId] = group[optionId] || 0;

        group[optionId] += 1;

        return group;
      },
      {}
    );

    const maxSubmittedOptions = [];

    const maxSubmittedOptionId = Object.keys(groupedSubmissionCount)
      .map((optionId) => ({
        optionId,
        count: groupedSubmissionCount[optionId],
      }))
      .sort((a, b) => {
        if (a.count > b.count) {
          return -1;
        }
        if (a.count < b.count) {
          return 1;
        }
        return 0;
      })[0]?.optionId;

    Object.keys(groupedSubmissionCount).forEach((optionId) => {
      if (
        groupedSubmissionCount[optionId] ===
        groupedSubmissionCount[maxSubmittedOptionId]
      ) {
        maxSubmittedOptions.push(optionId);
      }
    });

    return {
      localSubmittedOption,
      totalSubmissions,
      groupedSubmissionCount,
      maxSubmittedOptions,
    };
  }, [poll, localParticipantId]);

  return (
    <Box style={{ borderBottom: "1px solid #70707033" }}>
      <Box
        style={{
          margin: padding,
          marginTop: marginY,
          marginBottom: marginY,
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            padding: 0,
            margin: 0,
          }}
        >
          <Typography
            style={{
              fontSize: 14,
              color: "#95959E",
              fontWeight: 500,
              marginTop: 0,
              marginBottom: 0,
            }}
          >{`Poll ${totalPolls - index}`}</Typography>
          <p
            style={{
              marginLeft: 8,
              marginRight: 8,
              color: "#95959E",
              fontWeight: 500,
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            &#x2022;
          </p>
          <Typography
            style={{
              fontSize: 14,
              color: isPollActive ? "#FF5D5D" : "#95959E",
              fontWeight: 500,
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            {isPollActive
              ? hasTimer
                ? `Endes in ${secondsToMinutes(timeLeft)}`
                : "Live"
              : "Ended"}
          </Typography>
        </Box>
        <Box style={{ marginTop: 20 }}>
          <Typography style={{ fontSize: 16, color: "white", fontWeight: 600 }}>
            {poll.question}
          </Typography>
          <Box style={{ marginTop: 24 }}>
            {localSubmittedOption || !isPollActive
              ? poll.options.map((option) => {
                  const total = groupedSubmissionCount[option.optionId];

                  const isOptionSubmittedByLocal =
                    localSubmittedOption?.optionId === option.optionId;

                  const percentage =
                    (total ? total / totalSubmissions : 0) * 100;

                  const isOptionSelectedByLocalIncorrect =
                    localSubmittedOption?.optionId === option.optionId &&
                    !option.isCorrect;

                  const isCorrectOption = option.isCorrect;

                  return (
                    <Box
                      style={{
                        display: "flex",
                        marginBottom: 12,
                      }}
                    >
                      <Box
                        style={{
                          marginTop: 0,
                          width: "100%",
                        }}
                      >
                        <Box style={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            style={{
                              fontSize: 16,
                              color: "white",
                              fontWeight: 500,
                            }}
                          >
                            {option.option}
                          </Typography>

                          {isPollActive ? (
                            isOptionSubmittedByLocal ? (
                              <Box style={{ marginLeft: 8 }}>
                                <AnswerSubmittedIcon />
                              </Box>
                            ) : null
                          ) : hasCorrectAnswer ? (
                            isCorrectOption ? (
                              <Tooltip
                                placement="right"
                                title={"Correct Answer"}
                              >
                                <Box
                                  style={{
                                    marginLeft: 8,
                                    cursor: "pointer",
                                  }}
                                >
                                  <CorrectSelectedIcon />
                                </Box>
                              </Tooltip>
                            ) : isOptionSelectedByLocalIncorrect ? (
                              <Tooltip
                                placement="right"
                                title={"Your answer is wrong"}
                              >
                                <Box
                                  style={{
                                    marginLeft: 8,
                                    cursor: "pointer",
                                  }}
                                >
                                  <WrongOptionSelectedIcon />
                                </Box>
                              </Tooltip>
                            ) : null
                          ) : null}
                        </Box>
                        <Box
                          style={{
                            marginTop: 4,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            style={{
                              height: 6,
                              backgroundColor: "#3D3C4E",
                              borderRadius: 4,
                              display: "flex",
                              flex: 1,
                            }}
                          >
                            <Box
                              style={{
                                backgroundColor:
                                  hasCorrectAnswer && isActive
                                    ? isCorrectOption
                                      ? "#1178F8"
                                      : "#9E9DA6"
                                    : maxSubmittedOptions.includes(
                                        option.optionId
                                      )
                                    ? "#1178F8"
                                    : "#9E9DA6",
                                width: `${percentage}%`,
                                borderRadius: 4,
                              }}
                            ></Box>
                          </Box>
                          <Typography style={{ marginLeft: 24 }}>
                            {`${Math.floor(percentage)}%`}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                })
              : poll?.options.map((option) => {
                  return (
                    <Box
                      style={{
                        display: "flex",
                        marginBottom: 12,
                      }}
                    >
                      <MarkCorrectCheckbox
                        onClick={() => {
                          publish(
                            { optionId: option.optionId },
                            { persist: true }
                          );
                        }}
                      />
                      <Box
                        style={{
                          marginLeft: 8,
                          backgroundColor: "#3D3C4E",
                          padding: "12px 12px 12px",
                          width: "100%",
                          borderRadius: "4px",
                        }}
                      >
                        <Typography>{option.option}</Typography>
                      </Box>
                    </Box>
                  );
                })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const SubmitPollList = ({ panelHeight }) => {
  const { polls } = useMeetingAppContext();

  return (
    <Box
      style={{
        height: panelHeight - 14,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          height: "100%",
        }}
      >
        {polls.length > 0 ? (
          polls.map((poll, index) => {
            return (
              <SubmitPollListItem
                key={`submit_polls_${index}`}
                totalPolls={polls.length}
                poll={poll}
                panelHeight={panelHeight}
                index={index}
              />
            );
          })
        ) : (
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              marginTop: "-50px",
            }}
          >
            <NoPollActiveIcon />
            <Typography
              style={{ color: "white", fontSize: 16, fontWeight: 700 }}
            >
              No Poll has been launched yet.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SubmitPollList;
