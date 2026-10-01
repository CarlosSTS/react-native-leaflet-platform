package com.reactnativeleafletplatform.utils

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import java.io.ByteArrayOutputStream

object IconUtils {
    /**
     * Converts an app icon [Drawable] into a PNG data URI, ready to be used
     * as an `<img src>` on the map or in a React Native `<Image>` source.
     */
    fun getAppIconBase64(icon: Drawable): String {
        val bitmap: Bitmap =
            if (icon is BitmapDrawable && icon.bitmap != null) {
                icon.bitmap
            } else {
                val width = icon.intrinsicWidth.takeIf { it > 0 } ?: 1
                val height = icon.intrinsicHeight.takeIf { it > 0 } ?: 1

                Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888).apply {
                    val canvas = Canvas(this)
                    icon.setBounds(0, 0, canvas.width, canvas.height)
                    icon.draw(canvas)
                }
            }

        val outputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)

        val encoded = Base64.encodeToString(outputStream.toByteArray(), Base64.NO_WRAP)

        return "data:image/png;base64,$encoded"
    }
}
