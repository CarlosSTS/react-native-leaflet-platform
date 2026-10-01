import CoreLocation
import React
import UIKit

@objc(LeafletPlatform)
class LeafletPlatform: NSObject, CLLocationManagerDelegate {

    private static let E_MISSING_USAGE_DESCRIPTION = "E_MISSING_USAGE_DESCRIPTION"

    private var locationManager: CLLocationManager?
    private var pendingResolvers: [RCTPromiseResolveBlock] = []
    private var activeObserver: NSObjectProtocol?

    /**
     * Requests location permission and resolves with the resulting authorization status:
     * `granted` (when in use), `always`, `denied`, `restricted` or `disabled`.
     *
     * Only prompts when the status is still undetermined, or when `requestBackground` is set
     * and only "when in use" was granted. iOS never prompts twice, so a denied status is
     * returned as-is and the user must change it in Settings.
     */
    @objc(requestLocationPermission:resolver:rejecter:)
    func requestLocationPermission(
        _ options: NSDictionary?,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        let requestBackground = options?["requestBackground"] as? Bool ?? false

        DispatchQueue.main.async {
            let manager = self.locationManager ?? CLLocationManager()
            manager.delegate = self
            self.locationManager = manager

            let status = manager.authorizationStatus

            if status == .notDetermined {
                guard Self.hasUsageDescription("NSLocationWhenInUseUsageDescription") else {
                    reject(
                        Self.E_MISSING_USAGE_DESCRIPTION,
                        "Add NSLocationWhenInUseUsageDescription to your Info.plist.",
                        nil
                    )
                    return
                }
                self.enqueue(resolve)
                manager.requestWhenInUseAuthorization()
                return
            }

            if status == .authorizedWhenInUse && requestBackground {
                guard Self.hasUsageDescription("NSLocationAlwaysAndWhenInUseUsageDescription") else {
                    reject(
                        Self.E_MISSING_USAGE_DESCRIPTION,
                        "Add NSLocationAlwaysAndWhenInUseUsageDescription to your Info.plist.",
                        nil
                    )
                    return
                }
                self.enqueue(resolve)
                manager.requestAlwaysAuthorization()
                return
            }

            resolve(self.statusString(status))
        }
    }

    // MARK: - CLLocationManagerDelegate

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        // Also fires right after the manager is created, before the user answers.
        guard manager.authorizationStatus != .notDetermined else {
            return
        }
        flushPending()
    }

    // MARK: - Helpers

    private func enqueue(_ resolve: @escaping RCTPromiseResolveBlock) {
        pendingResolvers.append(resolve)

        // iOS does not call the delegate when the "Always" upgrade prompt is dismissed
        // without a change, so the app becoming active again also settles the request.
        guard activeObserver == nil else {
            return
        }
        activeObserver = NotificationCenter.default.addObserver(
            forName: UIApplication.didBecomeActiveNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            self?.flushPending()
        }
    }

    private func flushPending() {
        guard !pendingResolvers.isEmpty, let manager = locationManager else {
            return
        }

        let status = statusString(manager.authorizationStatus)
        let resolvers = pendingResolvers
        pendingResolvers.removeAll()

        if let observer = activeObserver {
            NotificationCenter.default.removeObserver(observer)
            activeObserver = nil
        }

        resolvers.forEach { $0(status) }
    }

    private func statusString(_ status: CLAuthorizationStatus) -> String {
        switch status {
        case .authorizedAlways:
            return "always"
        case .authorizedWhenInUse:
            return "granted"
        case .restricted:
            return "restricted"
        case .denied:
            return CLLocationManager.locationServicesEnabled() ? "denied" : "disabled"
        default:
            return "denied"
        }
    }

    private static func hasUsageDescription(_ key: String) -> Bool {
        Bundle.main.object(forInfoDictionaryKey: key) != nil
    }
}
