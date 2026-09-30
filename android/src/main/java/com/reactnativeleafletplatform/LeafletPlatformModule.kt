package com.reactnativeleafletplatform

import android.content.ActivityNotFoundException
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.reactnativeleafletplatform.utils.IconUtils

class LeafletPlatformModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "LeafletPlatform"

        private const val E_VALIDATION_FAILS = "E_VALIDATION_FAILS"
        private const val E_PACKAGE_NOT_FOUND = "E_PACKAGE_NOT_FOUND"
        private const val E_UNSUPPORTED_URL = "E_UNSUPPORTED_URL"
        private const val E_QUERY_APPS_FAILED = "E_QUERY_APPS_FAILED"
        private const val E_OPEN_APP_FAILED = "E_OPEN_APP_FAILED"

        /** Probe intent used to discover apps able to handle geographic locations. */
        private const val GEO_PROBE_URI = "geo:0,0?q="
    }

    override fun getName(): String = NAME

    /**
     * Lists the installed apps able to handle `geo:` intents (Google Maps, Waze, Uber, …).
     *
     * Requires the `<queries>` declaration shipped in this library's AndroidManifest so the
     * results are visible on Android 11+ (API 30) package visibility rules.
     */
    @ReactMethod
    fun getLocationApps(options: ReadableMap?, promise: Promise) {
        val includesBase64 =
            options?.takeIf { it.hasKey("includesBase64") }?.getBoolean("includesBase64") ?: false

        val packageManager = reactApplicationContext.packageManager
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(GEO_PROBE_URI))

        val resolved = try {
            packageManager.queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY)
        } catch (error: Exception) {
            promise.reject(E_QUERY_APPS_FAILED, "Failed to query location apps.", error)
            return
        }

        val result = WritableNativeArray()
        val seenPackages = mutableSetOf<String>()

        for (resolveInfo in resolved) {
            val applicationInfo = resolveInfo.activityInfo.applicationInfo
            val packageName = applicationInfo.packageName

            // A single app may expose several matching activities.
            if (!seenPackages.add(packageName)) {
                continue
            }

            val appData = WritableNativeMap().apply {
                putString("name", packageManager.getApplicationLabel(applicationInfo).toString())
                putString("package", packageName)

                if (includesBase64) {
                    // A missing icon must not discard the whole list.
                    val icon = try {
                        IconUtils.getAppIconBase64(packageManager.getApplicationIcon(applicationInfo))
                    } catch (error: Exception) {
                        null
                    }

                    if (icon != null) {
                        putString("icon", icon)
                    }
                }
            }

            result.pushMap(appData)
        }

        promise.resolve(result)
    }

    /**
     * Opens an installed app on a given location URL (for example `geo:`, `waze://`, `uber://`).
     *
     * Rejects when the package is not installed or cannot handle the URL.
     */
    @ReactMethod
    fun openAppWithLocation(options: ReadableMap?, promise: Promise) {
        if (options == null) {
            promise.reject(E_VALIDATION_FAILS, "Options are required.")
            return
        }

        val url = options.takeIf { it.hasKey("url") }?.getString("url")
        val packageName = options.takeIf { it.hasKey("packageName") }?.getString("packageName")

        if (url.isNullOrEmpty()) {
            promise.reject(E_VALIDATION_FAILS, "`url` is required.")
            return
        }

        if (packageName.isNullOrEmpty()) {
            promise.reject(E_VALIDATION_FAILS, "`packageName` is required.")
            return
        }

        val packageManager = reactApplicationContext.packageManager

        try {
            packageManager.getPackageInfo(packageName, 0)
        } catch (error: PackageManager.NameNotFoundException) {
            promise.reject(E_PACKAGE_NOT_FOUND, "App not found for package: $packageName")
            return
        }

        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
            setPackage(packageName)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }

        try {
            reactApplicationContext.startActivity(intent)
            promise.resolve(true)
        } catch (error: ActivityNotFoundException) {
            promise.reject(E_UNSUPPORTED_URL, "$packageName does not handle the URL: $url", error)
        } catch (error: Exception) {
            promise.reject(E_OPEN_APP_FAILED, "Failed to open $packageName.", error)
        }
    }
}
