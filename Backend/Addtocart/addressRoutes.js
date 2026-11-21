
import express from "express";
import db from "./db.js";
import { authenticateToken } from "./authMiddleware.js";

const router = express.Router();

// All address APIs require login
router.use("/addresses", authenticateToken);

// Validate address details
function validateAddress(data) {
  const {
    fullName,
    phone,
    address,
    city,
    state,
    postalCode,
  } = data;

  if (
    !fullName?.trim() ||
    !phone?.trim() ||
    !address?.trim() ||
    !city?.trim() ||
    !state?.trim() ||
    !postalCode?.trim()
  ) {
    return "Please fill all required address fields.";
  }

  if (!/^[0-9]{10}$/.test(phone.trim())) {
    return "Please enter a valid 10-digit phone number.";
  }

  if (!/^[0-9]{6}$/.test(postalCode.trim())) {
    return "Please enter a valid 6-digit PIN code.";
  }

  return null;
}

// GET: Fetch logged-in user's saved addresses
router.get("/addresses", async (req, res) => {
  try {
    const [addresses] = await db.query(
      `SELECT *
       FROM user_addresses
       WHERE user_id = ?
       ORDER BY is_default DESC, id DESC`,
      [req.user.id]
    );

    return res.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("Fetch addresses error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch saved addresses.",
    });
  }
});

// POST: Add a new address
router.post("/addresses", async (req, res) => {
  const connection = await db.getConnection();

  try {
    const {
      fullName,
      phone,
      address,
      apartment,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    const validationError = validateAddress(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    await connection.beginTransaction();

    const [existing] = await connection.query(
      "SELECT id FROM user_addresses WHERE user_id = ? LIMIT 1",
      [req.user.id]
    );

    // First address automatically becomes the default
    const makeDefault = Boolean(isDefault) || existing.length === 0;

    if (makeDefault) {
      await connection.query(
        "UPDATE user_addresses SET is_default = 0 WHERE user_id = ?",
        [req.user.id]
      );
    }

    const [result] = await connection.query(
      `INSERT INTO user_addresses
       (user_id, full_name, phone, address, apartment,
        city, state, postal_code, country, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        fullName.trim(),
        phone.trim(),
        address.trim(),
        apartment?.trim() || null,
        city.trim(),
        state.trim(),
        postalCode.trim(),
        country?.trim() || "India",
        makeDefault ? 1 : 0,
      ]
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Address saved successfully.",
      addressId: result.insertId,
      isDefault: makeDefault,
    });
  } catch (error) {
    await connection.rollback();

    console.error("Add address error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save address.",
    });
  } finally {
    connection.release();
  }
});

// PUT: Update an existing address
router.put("/addresses/:id", async (req, res) => {
  const connection = await db.getConnection();

  try {
    const addressId = Number(req.params.id);

    if (!Number.isInteger(addressId) || addressId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID.",
      });
    }

    const validationError = validateAddress(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const {
      fullName,
      phone,
      address,
      apartment,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    await connection.beginTransaction();

    const [existing] = await connection.query(
      `SELECT id
       FROM user_addresses
       WHERE id = ? AND user_id = ?
       FOR UPDATE`,
      [addressId, req.user.id]
    );

    if (!existing.length) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    if (isDefault === true) {
      await connection.query(
        "UPDATE user_addresses SET is_default = 0 WHERE user_id = ?",
        [req.user.id]
      );
    }

    await connection.query(
      `UPDATE user_addresses
       SET full_name = ?,
           phone = ?,
           address = ?,
           apartment = ?,
           city = ?,
           state = ?,
           postal_code = ?,
           country = ?,
           is_default = CASE WHEN ? = 1 THEN 1 ELSE is_default END
       WHERE id = ? AND user_id = ?`,
      [
        fullName.trim(),
        phone.trim(),
        address.trim(),
        apartment?.trim() || null,
        city.trim(),
        state.trim(),
        postalCode.trim(),
        country?.trim() || "India",
        isDefault === true ? 1 : 0,
        addressId,
        req.user.id,
      ]
    );

    await connection.commit();

    return res.json({
      success: true,
      message: "Address updated successfully.",
    });
  } catch (error) {
    await connection.rollback();

    console.error("Update address error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update address.",
    });
  } finally {
    connection.release();
  }
});

// PUT: Set an address as default
router.put("/addresses/:id/default", async (req, res) => {
  const connection = await db.getConnection();

  try {
    const addressId = Number(req.params.id);

    if (!Number.isInteger(addressId) || addressId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID.",
      });
    }

    await connection.beginTransaction();

    const [existing] = await connection.query(
      `SELECT id
       FROM user_addresses
       WHERE id = ? AND user_id = ?
       FOR UPDATE`,
      [addressId, req.user.id]
    );

    if (!existing.length) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    await connection.query(
      "UPDATE user_addresses SET is_default = 0 WHERE user_id = ?",
      [req.user.id]
    );

    await connection.query(
      `UPDATE user_addresses
       SET is_default = 1
       WHERE id = ? AND user_id = ?`,
      [addressId, req.user.id]
    );

    await connection.commit();

    return res.json({
      success: true,
      message: "Default address updated successfully.",
    });
  } catch (error) {
    await connection.rollback();

    console.error("Set default address error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to set default address.",
    });
  } finally {
    connection.release();
  }
});

// DELETE: Delete an address
router.delete("/addresses/:id", async (req, res) => {
  const connection = await db.getConnection();

  try {
    const addressId = Number(req.params.id);

    if (!Number.isInteger(addressId) || addressId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID.",
      });
    }

    await connection.beginTransaction();

    const [existing] = await connection.query(
      `SELECT id, is_default
       FROM user_addresses
       WHERE id = ? AND user_id = ?
       FOR UPDATE`,
      [addressId, req.user.id]
    );

    if (!existing.length) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    await connection.query(
      "DELETE FROM user_addresses WHERE id = ? AND user_id = ?",
      [addressId, req.user.id]
    );

    // If the default address was deleted, select another one
    if (existing[0].is_default) {
      const [remaining] = await connection.query(
        `SELECT id
         FROM user_addresses
         WHERE user_id = ?
         ORDER BY id DESC
         LIMIT 1`,
        [req.user.id]
      );

      if (remaining.length) {
        await connection.query(
          "UPDATE user_addresses SET is_default = 1 WHERE id = ?",
          [remaining[0].id]
        );
      }
    }

    await connection.commit();

    return res.json({
      success: true,
      message: "Address deleted successfully.",
    });
  } catch (error) {
    await connection.rollback();

    console.error("Delete address error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete address.",
    });
  } finally {
    connection.release();
  }
});

export default router;
