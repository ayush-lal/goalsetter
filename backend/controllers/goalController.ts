import asyncHandler from "express-async-handler";
import { Goal } from "../models/goalModel";

// @description: Get Goals
// @route: GET /api/goals
// @access: Private
export const getGoals = asyncHandler(async (req: any, res: any) => {
  const goals = await Goal.find();

  res.status(200).json(goals);
});

// @description: Set Goal
// @route: POST /api/goals
// @access: Private
export const setGoal = asyncHandler(async (req: any, res: any) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("please add a text field");
  }

  const goal = await Goal.create({
    text: req.body.text,
  });

  res.status(200).json(goal);
});

// @description: Update Goal
// @route: PUT /api/goals/{id}
// @access: Private
export const updateGoal = asyncHandler(async (req: any, res: any) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedGoal);
});

// @description: Delete Goal
// @route: DELETE /api/goals/{id}
// @access: Private
export const deleteGoal = asyncHandler(async (req: any, res: any) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  await goal.remove();

  res.status(200).json({ id: req.params.id });
});
