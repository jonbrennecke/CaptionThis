import Photos

typealias GlobalError = Error

class PhotosAlbumUtil {
  public enum Error: GlobalError {
    case unableToFindAlbum
    case unableToFindAlbumWithError(GlobalError)
  }

  private static let albumTitle = "Caption This"

  public static func withAlbum(_ completionHandler: @escaping (Result<PHAssetCollection, Error>) -> Void) {
    let fetchOptions = PHFetchOptions()
    fetchOptions.predicate = NSPredicate(format: "title = %@", albumTitle)
    let collection = PHAssetCollection.fetchAssetCollections(with: .album, subtype: .albumRegular, options: fetchOptions)
    if let album = collection.firstObject {
      completionHandler(.success(album))
      return
    }
    var albumPlaceholder: PHObjectPlaceholder?
    PHPhotoLibrary.shared().performChanges({
      let assetCollectionRequest = PHAssetCollectionChangeRequest.creationRequestForAssetCollection(withTitle: albumTitle)
      albumPlaceholder = assetCollectionRequest.placeholderForCreatedAssetCollection
    }) { success, error in
      if let error = error {
        completionHandler(.failure(.unableToFindAlbumWithError(error)))
        return
      }
      guard success, let albumPlaceholder = albumPlaceholder else {
        completionHandler(.failure(.unableToFindAlbum))
        return
      }
      let albumFetchResult = PHAssetCollection.fetchAssetCollections(withLocalIdentifiers: [albumPlaceholder.localIdentifier], options: nil)
      guard let album = albumFetchResult.firstObject else {
        completionHandler(.failure(.unableToFindAlbum))
        return
      }
      completionHandler(.success(album))
    }
  }
}
