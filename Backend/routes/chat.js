import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import auth from "../middleware/auth.js";

const router = express.Router();

//test
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "abc",
      title: "Testing New Thread2",
    });
    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save in DB" });
  }
});

//Get all Thread
router.get("/thread", auth, async (req, res) => {
  try {
    // console.log("Logged User:", req.user.id);
    const threads = await Thread.find({
      userId: req.user.id,
    }).sort({ updatedAt: -1 });
    // console.log("Threads Found:", threads);
    //descending order of updatedAt... most recent data on top
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fatch threads" });
  }
});

router.get("/thread/:threadId", auth, async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({
      threadId: threadId,
      userId: req.user.id,
    });

    if (!thread) {
      res.status(404).json({ error: " Thread not found" });
    }

    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fatch chat" });
  }
});

//Delete
router.delete("/thread/:threadId", auth, async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({
      threadId: threadId,
      userId: req.user.id,
    });

    if (!deletedThread) {
      res.status(404).json({ error: "Thread not found" });
    }

    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

//Post/Chat
router.post("/chat", auth, async (req, res) => {
  const { threadId, message } = req.body;

  const userId = req.user.id;

  if (!threadId || !message) {
    return res.status(400).json({ error: "missing required fielda" });
  }

  try {
    let thread = await Thread.findOne({ threadId, userId });

    if (!thread) {
      //create a new thread in DB
      thread = new Thread({
        threadId,
        userId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getOpenAIAPIResponse(message);

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();
    // console.log("Thread Saved:", thread);
    res.json({ reply: assistantReply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
